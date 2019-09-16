#!/bin/bash
# should produce 576 files (with arpeggios enabled)

# SCALES 216
for KEY in A Bb B C Db D E Eb F Gb G Ab
do
    for SCALE in major natural_minor harmonic_minor # TODO 2 more scales
    do
        for OCTAVES in 1 2
        do
            for tempo in 80 120 160
            do
                key=$KEY
                scale=$SCALE
                octaves=$OCTAVES
                tempo=$tempo

                python lilypond_example.py scale $key $scale $octaves $tempo
                sleep 0.5

                outfile="scale_${key}_${scale}_${octaves}o_${tempo}"
                ./ly2midi --outfile $outfile "$outfile.ly"
                fluidsynth -F "$outfile.wav" Masterpiece.sf2 "$outfile.midi"
                # image lilypond --png scale_C_major_2o_80.ly
            done
        done
    done
done

# ARPEGGIOS
# for KEY in A Bb B C Db D E Eb F Gb G Ab
# do
#     for SCALE in m maj dim7 dom7
#     do
#         for OCTAVES in 1 2
#         do
#             for tempo in 80 120 160
#             do
#                 key=$KEY
#                 scale=$SCALE
#                 octaves=$OCTAVES
#                 tempo=$tempo

#                 python lilypond_example.py arpeggio $key $scale $octaves $tempo
#                 sleep 0.5

#                 outfile="arpeggio_${key}_${scale}_${octaves}o_${tempo}"
#                 ./ly2midi --outfile $outfile "$outfile.ly"
#                 fluidsynth -F "$outfile.wav" Masterpiece.sf2 "$outfile.midi"
#             done
#         done
#     done
# done
