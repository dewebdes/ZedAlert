#!/bin/bash

# Function to print usage information
function usage {
  echo "Usage: $0 [-o OPTION] [-f FILE] <text>"
  echo "-o OPTION: Output format (text, html)"
  echo "-f FILE: Output file name"
  exit 1
}

# Parse arguments
while getopts ":o:f:" opt; do
  case $opt in
    o) output_format=$OPTARG ;;
    f) output_file=$OPTARG ;;
    \?) usage ;;
  esac
done

# Shift arguments to remove processed options
shift $OPTIND

# Get the remaining text (non-option argument)
text="$@"

# Process the text based on options and print result
case $output_format in
  text)
    echo "Text output: $text" ;;
  html)
    echo "<html><body>$text</body></html>" > "$output_file"
    echo "Wrote HTML output to: $output_file" ;;
  *)
    echo "Invalid output format: $output_format"
    usage ;;
esac

#while read url; do
#  echo $url
#  host=$(echo $url | sed -e 's/[^/]*\/\/\([^@]*@\)\?\([^:/]*\).*/\2/')
#  eval "cewl -d 0 $url >> $host.log"
#  eval "sed -i '/Robin Wood/d' $host.log"
#  eval "sort $host.log | uniq > $host.log2"
#  eval "echo $url parsed"
#done <url.txt
