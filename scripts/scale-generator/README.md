# Prerequisites

## [Musthe](https://github.com/gciruelos/musthe)

**For writing music notation using code**

`pip3 install musthe`

Using Python 3

## [ly2midi](https://github.com/andreasjansson/ly2midi)

**For turning code into midi files**

`pip install musthe`

Using Python 2

**Depends on Lilypond**: http://lilypond.org/doc/v2.19/Documentation/notation/midi-instruments

## Midi2Audio

**For turning code into midi files**

`pip3 install midi2audio`

Using Python 3

**Depends on FluidSynth**: `brew install fluid-synth` (using Homebrew)

## ffmpeg

**For turning code into midi files**

`brew install ffpmeg`

And `libmp3lame` http://lame.sourceforge.net/

## aws

`pip3 install awscli`

And configure.

# Running

## Generating wav files from code (via midi)

`./generate_scale.sh`

- Uses a SoundFont2 file to determine the instrument sound. E.g. it's currently configured for `Masterpiece.sf2`.

## Normalising volume and making mp3 files

`./convertnorm.sh`

- mp3 files will appear in output/ directory
- ffmpeg path in this script may need to be changed

## Uploading to AWS s3 and making public

- `cd output` then `upload_s3_public.sh`

Will upload each file to an S3 bucket (configure the name yourself) and then make that file public.
