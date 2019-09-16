#!/bin/bash

for FILE in *.mp3
do
	echo "Upload.." $FILE
	aws s3 cp $FILE s3://androula-host/scale-helper/$FILE
done


for FILE in *.mp3
do
	echo "Public.." $FILE
	aws s3api put-object-acl --bucket androula-host --key scale-helper/$FILE --acl public-read
done