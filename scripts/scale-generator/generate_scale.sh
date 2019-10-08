#!/bin/bash
# should produce over 700 files (with arpeggios enabled)

# SCALES crotchet
# for KEY in A Bb B C Db D E Eb F Gb G Ab
# do
#     for SCALE in major melodic_minor harmonic_minor
#     # for SCALE in melodic_minor
#     do
#         for OCTAVES in 1 2
#         do
#             for tempo in 60
#             do
#                 key=$KEY
#                 scale=$SCALE
#                 octaves=$OCTAVES
#                 tempo=$tempo

#                 python lilypond_example.py scale_crotchet $key $scale $octaves $tempo
#                 sleep 0.5

#                 outfile="scale_${key}_${scale}_${octaves}o_${tempo}_crotchet"
#                 ./ly2midi --outfile $outfile "$outfile.ly"
#                 fluidsynth -F "$outfile.wav" Masterpiece.sf2 "$outfile.midi"
#                 # image lilypond --png scale_C_major_2o_80.ly
#             done
#         done
#     done
# done

#SCALES
for KEY in C A Bb B C Db D E Eb F Gb G Ab
do
    for SCALE in major melodic_minor harmonic_minor
    # for SCALE in melodic_minor
    do
        for OCTAVES in 1 2
        do
            for tempo in 25 40 70 140
            do
                key=$KEY
                scale=$SCALE
                octaves=$OCTAVES
                tempo=$tempo

                python lilypond_example.py scale $key $scale $octaves $tempo
                sleep 0.1

                outfile="scale_${key}_${scale}_${octaves}o_${tempo}"
                ./ly2midi --outfile $outfile "$outfile.ly"
                fluidsynth -F "$outfile.wav" "HQ Orchestral Soundfont Collection v3.0.sf2" "$outfile.midi"
                # image lilypond --png scale_C_major_2o_80.ly
            done
        done
    done
done

# ARPEGGIOS crotchet
# for KEY in A Bb B C Db D E Eb F Gb G Ab
# do
#     for SCALE in m maj dim7 dom7
#     do
#         for OCTAVES in 1 2
#         do
#             for tempo in 60
#             do
#                 key=$KEY
#                 scale=$SCALE
#                 octaves=$OCTAVES
#                 tempo=$tempo

#                 python lilypond_example.py arpeggio_crotchet $key $scale $octaves $tempo
#                 sleep 0.2

#                 outfile="arpeggio_${key}_${scale}_${octaves}o_${tempo}_crotchet"
#                 ./ly2midi --outfile $outfile "$outfile.ly"
#                 fluidsynth -F "$outfile.wav" Masterpiece.sf2 "$outfile.midi"
#                 # image lilypond --png scale_C_major_2o_80.ly
#             done
#         done
#     done
# done

ARPEGGIOS
for KEY in A Bb B C Db D E Eb F Gb G Ab
do
    for SCALE in m maj dim7 dom7
    do
        for OCTAVES in 1 2
        do
            for tempo in 25 40 70 140
            do
                key=$KEY
                scale=$SCALE
                octaves=$OCTAVES
                tempo=$tempo

                python lilypond_example.py arpeggio $key $scale $octaves $tempo
                sleep 0.1

                outfile="arpeggio_${key}_${scale}_${octaves}o_${tempo}"
                ./ly2midi --outfile $outfile "$outfile.ly"
                fluidsynth -F "$outfile.wav" "HQ Orchestral Soundfont Collection v3.0.sf2" "$outfile.midi"
            done
        done
    done
done
