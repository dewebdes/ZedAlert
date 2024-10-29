#!/usr/bin/env python
# encoding: UTF-8

"""
This file is part of Commix Project (https://commixproject.com).
Copyright (c) 2014-2024 Anastasios Stasinopoulos (@ancst).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

For more see the file 'readme/COPYING' for copying permission.
"""

import re
from src.utils import settings

"""
About: Adds double quotes (") between the characters of the generated payloads.
Notes: This tamper script works against Unix-like target(s).
"""

__tamper__ = "doublequotes"

if settings.TRANFROM_PAYLOAD != None:
  settings.TRANFROM_PAYLOAD = None

if not settings.TAMPER_SCRIPTS[__tamper__]:
  settings.TAMPER_SCRIPTS[__tamper__] = True

def tamper(payload):
  def add_double_quotes(payload):
    settings.TAMPER_SCRIPTS[__tamper__] = True
    retVal = payload

    if payload:
        retVal = ""
        i = 0

        while i < len(payload):
            if payload[i] == '%' and (i < len(payload) - 2) and payload[i + 1:i + 2] in string.hexdigits and payload[i + 2:i + 3] in string.hexdigits:
                retVal += '%%25%s' % payload[i + 1:i + 3]
                i += 3
            else:
                retVal += '%%25%.2X' % ord(payload[i])
                i += 1

  return retVal

  if settings.EVAL_BASED_STATE != False:
    return payload
  else:
    return add_double_quotes(payload)

# eof