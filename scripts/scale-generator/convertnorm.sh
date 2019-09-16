#!/bin/bash
for FILE in *.wav
do
  /usr/local/bin/ffmpeg -i $FILE -c:v libx264 -b:v 4000k -pass 2 -filter:a loudnorm=linear=true:measured_I=-50.35:measured_LRA=2.50:measured_tp=-35:measured_thresh=-50 -ac 2 -codec:a libmp3lame -b:a 48k -ar 16000 "output/${FILE%%.*}".mp3 >> results.out
done
