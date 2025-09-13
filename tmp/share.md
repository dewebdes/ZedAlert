#!/usr/bin/env python3
import math
import json
import os
import sys
from datetime import datetime, timedelta, timezone

# 3rd-party libs:
#   pip install jdatetime pytz ntplib python-dateutil
import jdatetime
import pytz
import ntplib
from ntplib import NTPException
from dateutil.relativedelta import relativedelta

SETTINGS_FILE = "settings.json"


def load_or_ask_settings():
    if os.path.exists(SETTINGS_FILE):
        s = json.load(open(SETTINGS_FILE))
        print("⚙️  Found saved settings:")
        print(f"    Name       : {s['name']}")
        print(f"    Shamsi BDay: {s['shamsi_bday']}")
        print(f"    Country    : {s['country']}")
        if input("Use these? [Y/n]: ").strip().lower() in ("", "y", "yes"):
            return s

    s = {
        "name":        input("Enter your full name (English): ").strip(),
        "shamsi_bday": input("Enter your birth date (Shamsi DD-MM-YYYY): ").strip(),
        "country":     input("Enter your country code (ISO alpha-2, e.g. IR): ").strip().upper(),
    }
    with open(SETTINGS_FILE, "w") as f:
        json.dump(s, f, indent=2)
    return s


def shamsi_to_gregorian(shamsi: str) -> datetime:
    d, m, y = map(int, shamsi.split("-"))
    gd = jdatetime.date(y, m, d).togregorian()
    return datetime(gd.year, gd.month, gd.day)


def digit_reduce(n: int) -> int:
    s = sum(int(d) for d in str(n))
    return s if s < 10 or s in (11, 22, 33) else digit_reduce(s)


def compute_life_path(birth: datetime) -> int:
    return digit_reduce(int(birth.strftime("%Y%m%d")))


def get_true_utc() -> datetime:
    try:
        client = ntplib.NTPClient()
        r = client.request("pool.ntp.org", version=3)
        return datetime.fromtimestamp(r.tx_time, timezone.utc)
    except (NTPException, OSError):
        return datetime.now(timezone.utc)


def choose_timezone(country: str):
    try:
        zone = pytz.country_timezones[country][0]
        return pytz.timezone(zone)
    except Exception:
        return None


def find_next(lp: int,
              start: datetime,
              resolution: str,
              horizon_h: int = 24,
              horizon_d: int = 365) -> datetime:
    if resolution == "day":
        cursor = (start
                  .replace(hour=0, minute=0, second=0, microsecond=0)
                  + timedelta(days=1))
        deadline = cursor + timedelta(days=horizon_d)
        fmt, step = "%Y%m%d", timedelta(days=1)

    elif resolution == "hour":
        cursor = (start
                  .replace(minute=0, second=0, microsecond=0)
                  + timedelta(hours=1))
        deadline = cursor + timedelta(hours=horizon_h)
        fmt, step = "%H", timedelta(hours=1)

    elif resolution == "minute":
        cursor = start + timedelta(minutes=1)
        deadline = start + timedelta(hours=horizon_h)
        fmt, step = "%H%M", timedelta(minutes=1)

    elif resolution == "second":
        cursor = start + timedelta(seconds=1)
        deadline = start + timedelta(hours=horizon_h)
        fmt, step = "%H%M%S", timedelta(seconds=1)

    elif resolution == "month":
        cursor = (start
                  .replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                  + relativedelta(months=1))
        deadline = cursor + relativedelta(months=horizon_d)
        fmt, step = "%Y%m", relativedelta(months=1)

    elif resolution == "year":
        cursor = (start
                  .replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
                  + relativedelta(years=1))
        deadline = cursor + relativedelta(years=horizon_d)
        fmt, step = "%Y", relativedelta(years=1)

    else:
        raise ValueError(f"Unknown resolution: {resolution}")

    while cursor <= deadline:
        if digit_reduce(int(cursor.strftime(fmt))) == lp:
            return cursor
        cursor += step

    raise ValueError(f"No {resolution}-level chance within horizon.")


def main():
    settings = load_or_ask_settings()
    birth_g  = shamsi_to_gregorian(settings["shamsi_bday"])
    lp       = compute_life_path(birth_g)

    use_ntp = input("Fetch UTC from network? [Y/n]: ").strip().lower() in ("", "y", "yes")
    now_utc = get_true_utc() if use_ntp else datetime.now(timezone.utc)

    # find next chance across resolutions
    nxt_sec   = find_next(lp, now_utc, "second")
    nxt_min   = find_next(lp, now_utc, "minute")
    nxt_hr    = find_next(lp, now_utc, "hour")
    nxt_day   = find_next(lp, now_utc, "day")
    nxt_month = find_next(lp, now_utc, "month", horizon_d=12)
    nxt_year  = find_next(lp, now_utc, "year",  horizon_d=10)

    # compute raw deltas in seconds for each resolution
    delta_sec = (nxt_sec  - now_utc).total_seconds()
    delta_min = (nxt_min  - now_utc).total_seconds()
    delta_hr  = (nxt_hr   - now_utc).total_seconds()
    delta_day = (nxt_day  - now_utc).total_seconds()

    # ceil-based remaining ticks
    rem_sec  = math.ceil(delta_sec)
    rem_min  = math.ceil(delta_min /   60)
    rem_hr   = math.ceil(delta_hr  / 3600)
    rem_day  = math.ceil(delta_day /86400)
    rem_mon  = (nxt_month.year - now_utc.year) * 12 + (nxt_month.month - now_utc.month)
    rem_year = nxt_year.year - now_utc.year

    # percent into each horizon
    pct_sec  = 100 * (1 - rem_sec  / (24*3600))
    pct_min  = 100 * (1 - rem_min  / (24*  60))
    pct_hr   = 100 * (1 - rem_hr   / 24)
    pct_day  = 100 * (1 - rem_day  / 365)
    pct_mon  = 100 * (1 - rem_mon  / 12)
    pct_year = 100 * (1 - rem_year / 10)

    # compute 100% horizon ends and past-100% starts
    start_day  = now_utc.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
    h100_day   = start_day + timedelta(days=365)
    p100_day   = start_day - timedelta(days=365)

    start_mon  = (now_utc.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
                  + relativedelta(months=1))
    h100_mon   = start_mon + relativedelta(months=12)
    p100_mon   = start_mon - relativedelta(months=12)

    start_year = (now_utc.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
                  + relativedelta(years=1))
    h100_year  = start_year + relativedelta(years=10)
    p100_year  = start_year - relativedelta(years=10)

    # local timezone conversions
    tz = choose_timezone(settings["country"])
    if tz:
        now_loc   = now_utc.astimezone(tz)
        sec_loc   = nxt_sec.astimezone(tz)
        min_loc   = nxt_min.astimezone(tz)
        hr_loc    = nxt_hr.astimezone(tz)
        day_loc   = nxt_day.astimezone(tz)
        mon_loc   = nxt_month.astimezone(tz)
        year_loc  = nxt_year.astimezone(tz)
        h100d_loc = h100_day.astimezone(tz)
        p100d_loc = p100_day.astimezone(tz)
        h100m_loc = h100_mon.astimezone(tz)
        p100m_loc = p100_mon.astimezone(tz)
        h100y_loc = h100_year.astimezone(tz)
        p100y_loc = p100_year.astimezone(tz)
        label     = tz.zone
    else:
        now_loc   = now_utc.astimezone()
        sec_loc   = nxt_sec.astimezone()
        min_loc   = nxt_min.astimezone()
        hr_loc    = nxt_hr.astimezone()
        day_loc   = nxt_day.astimezone()
        mon_loc   = nxt_month.astimezone()
        year_loc  = nxt_year.astimezone()
        h100d_loc = h100_day.astimezone()
        p100d_loc = p100_day.astimezone()
        h100m_loc = h100_mon.astimezone()
        p100m_loc = p100_mon.astimezone()
        h100y_loc = h100_year.astimezone()
        p100y_loc = p100_year.astimezone()
        label     = "Device Local"

    # ─────────────────────────────────────────────────────────────────

    print(f"\n👋 Hello {settings['name']}!")
    print(f"🔢 Life-Path Number: {lp}\n")

    print("⏰ Current Time:")
    print(f"  • UTC        : {now_utc:%Y-%m-%d %H:%M:%S %Z}")
    print(f"  • {label} : {now_loc:%Y-%m-%d %H:%M:%S %Z}\n")

    print("🎯 Next Chance (second-by-second):")
    print(f"  • UTC        : {nxt_sec:%Y-%m-%d %H:%M:%S %Z}")
    print(f"  • {label} : {sec_loc:%Y-%m-%d %H:%M:%S %Z}")
    print(f"  → Remaining  : {rem_sec} sec   ({pct_sec:.2f}% into 24h)\n")

    print("🎯 Next Chance (minute-by-minute):")
    print(f"  • UTC        : {nxt_min:%Y-%m-%d %H:%M:%S %Z}")
    print(f"  • {label} : {min_loc:%Y-%m-%d %H:%M:%S %Z}")
    print(f"  → Remaining  : {rem_min} min   ({pct_min:.2f}% into 24h)\n")

    print("🎯 Next Chance (hour-by-hour):")
    print(f"  • UTC        : {nxt_hr:%Y-%m-%d %H:%M:%S %Z}")
    print(f"  • {label} : {hr_loc:%Y-%m-%d %H:%M:%S %Z}")
    print(f"  → Remaining  : {rem_hr} hr    ({pct_hr:.2f}% into 24h)\n")

    print("🎯 Next Chance (day-by-day):")
    print(f"  • UTC        : {nxt_day:%Y-%m-%d} (all day)")
    print(f"  • {label} : {day_loc:%Y-%m-%d} (all day)")
    print(f"  → Remaining  : {rem_day} days ({pct_day:.2f}% into 365d)\n")

    print("🎯 Next Chance (month-by-month):")
    print(f"  • UTC        : {nxt_month:%Y-%m-%d}")
    print(f"  • {label} : {mon_loc:%Y-%m-%d}")
    print(f"  → Remaining  : {rem_mon} mo    ({pct_mon:.2f}% into 12 mo)\n")

    print("🎯 Next Chance (year-by-year):")
    print(f"  • UTC        : {nxt_year:%Y}")
    print(f"  • {label} : {year_loc:%Y}")
    print(f"  → Remaining  : {rem_year} yr    ({pct_year:.2f}% into 10 yr)\n")

    print("🔚 100% Chance Points (future horizon ends):")
    print(f"  • Day   : {h100_day:%Y-%m-%d %H:%M:%S} UTC  /  {h100d_loc:%Y-%m-%d %H:%M:%S} {label}")
    print(f"  • Month : {h100_mon:%Y-%m-%d %H:%M:%S} UTC  /  {h100m_loc:%Y-%m-%d %H:%M:%S} {label}")
    print(f"  • Year  : {h100_year:%Y-%m-%d %H:%M:%S} UTC  /  {h100y_loc:%Y-%m-%d %H:%M:%S} {label}\n")

    print("🔙 100% Chance Points (past horizon starts):")
    print(f"  • Day   : {p100_day:%Y-%m-%d %H:%M:%S} UTC  /  {p100d_loc:%Y-%m-%d %H:%M:%S} {label}")
    print(f"  • Month : {p100_mon:%Y-%m-%d %H:%M:%S} UTC  /  {p100m_loc:%Y-%m-%d %H:%M:%S} {label}")
    print(f"  • Year  : {p100_year:%Y-%m-%d %H:%M:%S} UTC  /  {p100y_loc:%Y-%m-%d %H:%M:%S} {label}\n")

    today_local_str = now_loc.strftime("%Y-%m-%d")
    today_dr = digit_reduce(int(now_loc.strftime("%Y%m%d")))

    if today_dr == lp:
        print(f"✅ Today ({today_local_str}) IS your Chance Day!")
    else:
        print(f"❌ Today ({today_local_str}) is NOT. Next Chance Day is {day_loc:%Y-%m-%d}.")

    print()


if __name__ == "__main__":
    main()
