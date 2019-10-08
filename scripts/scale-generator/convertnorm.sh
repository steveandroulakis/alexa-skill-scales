#!/bin/bash
for FILE in *.wav
do
  #/usr/local/bin/ffmpeg -i $FILE -c:v libx264 -b:v 4000k -pass 2 -filter:a loudnorm=linear=true:measured_I=-19:measured_LRA=2.30:measured_tp=-0.96:measured_thresh=-20 -ac 1 -codec:a libmp3lame -b:a 48k -ar 16000 "output/${FILE%%.*}".mp3 >> results.out
  /usr/local/bin/ffmpeg -i $FILE -filter:a "volume=8.1" -ac 1 "output/m${FILE%%.*}".wav >> results.out
  sleep 0.2
  /usr/local/bin/ffmpeg -i output/m$FILE -af acompressor=threshold=-13.5dB:ratio=3:attack=0.05:release=600 "output/c${FILE%%.*}".wav >> results.out
  sleep 0.2
  /usr/local/bin/ffmpeg -i output/c$FILE -filter:a "volume=3.5" "output/${FILE%%.*}".wav >> results.out
  sleep 0.2
  /usr/local/bin/ffmpeg -i output/$FILE -codec:a libmp3lame -b:a 48k -ar 24000 -write_xing 0 "output/${FILE%%.*}".mp3 >> results.out
  rm output/c$FILE output/m$FILE output/$FILE #
done
