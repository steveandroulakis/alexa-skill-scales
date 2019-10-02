#!/usr/bin/env python
# -*- coding: utf-8 -*-

from musthe import *
import sys


def lilypond_composer(bars, tempo, instrument='electric piano 1', file_name='example.ly'):
    f = open(file_name, 'w')
    f.write('''\\score {
    \\new Voice \\relative c\' {
        \\set midiInstrument = #"'''+instrument+'"\n')
    for bar in bars:
        f.write('\t\t'+bar+'\n')
    f.write('''
    }
    \\midi{
        \\tempo 4 = %s
        \\context {
            \\Voice
            \\consists "Staff_performer"
        }
    }
    \\layout { }
}''' % tempo)
    f.close()
    # timidity <input-file> -Ow -o <output-file>


def lilypond_composer_crotchet(bars, tempo, instrument='electric piano 1', file_name='example.ly'):
    f = open(file_name, 'w')
    f.write('''\\score {
    \\new Voice \\relative c\' {
        \\set midiInstrument = #"'''+instrument+'"\n')
    for bar in bars:
        f.write('\t\t'+bar+'\longa\n')
    f.write('''
    }
    \\midi{
        \\tempo 1 = %s
        \\context {
            \\Voice
            \\consists "Staff_performer"
        }
    }
    \\layout { }
}''' % tempo)
    f.close()
    # timidity <input-file> -Ow -o <output-file>


def scale_music(key, scale, octaves):
    n = Note(key)
    pool = Scale(n, scale)
    print(pool)
    print(len(pool))

    addnotes = 0
    if octaves == "2":
        addnotes = 7

    # steve + 1 is for the ocave above
    for index in range(len(pool)+addnotes+1):
        bar = []

        note = pool[index].lilypond_notation()

        '''
        difference = (bar[-1].octave)-(pool[index].octave)
        if difference == 1:
            note+=','
        elif difference == -1:
            note+='\''
        '''

        bar.append(note)

        yield ' '.join(bar)

    # descending scales
    for index in range(len(pool)+addnotes-1, -1, -1):
        bar = []

        note = pool[index].lilypond_notation()

        '''
        difference = (bar[-1].octave)-(pool[index].octave)
        if difference == 1:
            note+=','
        elif difference == -1:
            note+='\''
        '''

        bar.append(note)

        yield ' '.join(bar)


def scale_music_crotchet(key, scale, octaves):
    n = Note(key)
    pool = Scale(n, scale)
    print(pool)
    print(len(pool))

    addnotes = 0
    if octaves == "2":
        addnotes = 7

    # steve + 1 is for the ocave above
    for index in range(len(pool)+addnotes+1):
        bar = []

        note = pool[index].lilypond_notation()

        '''
        difference = (bar[-1].octave)-(pool[index].octave)
        if difference == 1:
            note+=','
        elif difference == -1:
            note+='\''
        '''

        bar.append(note)

        yield ' '.join(bar)

    # descending scales
    for index in range(len(pool)+addnotes-1, -1, -1):
        bar = []

        note = pool[index].lilypond_notation()

        '''
        difference = (bar[-1].octave)-(pool[index].octave)
        if difference == 1:
            note+=','
        elif difference == -1:
            note+='\''
        '''

        bar.append(note)

        yield ' '.join(bar)


def arpeggio_music(key, scale, octaves):
    octnum = int(octaves)

    pool_notes = []

    addnotes = 0
    if octaves == "2":
        addnotes = 0

    # this is to get around a WEIRD case sensitivity bug between M and m

    # pool = Chord(n, 'dim7')
    # pool = Chord(n, 'dom7')
    if scale == 'maj':
        scale = 'M'

    for o in range(1, octnum+1):
        octpos = 3+o

        n = Note('%s%s' % (key, octpos))
        pool = Chord(n, scale)
        pool_notes = pool_notes + pool.notes

    #print(pool_notes)

    # steve + 1 is for the ocave above
    for index in range(len(pool_notes)+addnotes):
        bar = []

        #print(pool_notes)
        #print(index)

        note = pool_notes[index].lilypond_notation()

        '''
        difference = (bar[-1].octave)-(pool[index].octave)
        if difference == 1:
            note+=','
        elif difference == -1:
            note+='\''
        '''

        bar.append(note)

        yield ' '.join(bar)

    # descending scales
    for index in range(len(pool_notes)+addnotes-2, -1, -1):
        bar = []

        note = pool_notes[index].lilypond_notation()

        '''
        difference = (bar[-1].octave)-(pool[index].octave)
        if difference == 1:
            note+=','
        elif difference == -1:
            note+='\''
        '''

        bar.append(note)

        yield ' '.join(bar)


def arpeggio_music_crotchet(key, scale, octaves):
    octnum = int(octaves)

    pool_notes = []

    addnotes = 0
    if octaves == "2":
        addnotes = 0

    # this is to get around a WEIRD case sensitivity bug between M and m

    # pool = Chord(n, 'dim7')
    # pool = Chord(n, 'dom7')
    if scale == 'maj':
        scale = 'M'

    for o in range(1, octnum+1):
        octpos = 3+o

        n = Note('%s%s' % (key, octpos))
        pool = Chord(n, scale)
        pool_notes = pool_notes + pool.notes

    #print(pool_notes)

    # steve + 1 is for the ocave above
    for index in range(len(pool_notes)+addnotes):
        bar = []

        # print(pool_notes)
        # print(index)

        note = pool_notes[index].lilypond_notation()

        '''
        difference = (bar[-1].octave)-(pool[index].octave)
        if difference == 1:
            note+=','
        elif difference == -1:
            note+='\''
        '''

        bar.append(note)

        yield ' '.join(bar)

    # descending scales
    for index in range(len(pool_notes)+addnotes-2, -1, -1):
        bar = []

        note = pool_notes[index].lilypond_notation()

        '''
        difference = (bar[-1].octave)-(pool[index].octave)
        if difference == 1:
            note+=','
        elif difference == -1:
            note+='\''
        '''

        bar.append(note)

        yield ' '.join(bar)


mode = str(sys.argv[1])
key = str(sys.argv[2])
scale = str(sys.argv[3])
octaves = str(sys.argv[4])
tempo = str(sys.argv[5])

if mode == "scale":
    lilypond_composer(scale_music(key, scale, octaves), tempo,
                      file_name="scale_%s_%s_%so_%s.ly" % (key, scale, octaves, tempo))
if mode == "scale_crotchet":
    lilypond_composer_crotchet(scale_music_crotchet(key, scale, octaves), tempo,
                      file_name="scale_%s_%s_%so_%s_crotchet.ly" % (key, scale, octaves, tempo))
elif mode == "arpeggio":
    lilypond_composer(arpeggio_music(key, scale, octaves), tempo,
                      file_name="arpeggio_%s_%s_%so_%s.ly" % (key, scale, octaves, tempo))
elif mode == "arpeggio_crotchet":
    lilypond_composer_crotchet(arpeggio_music_crotchet(key, scale, octaves), tempo,
                      file_name="arpeggio_%s_%s_%so_%s_crotchet.ly" % (key, scale, octaves, tempo))
else:
    print('~~~~ INVALID MODE. NEEDS TO BE SCALE OR ARPEGGIO OR SCALE_CROTCHET / ARPEGGIO_CROTCHET')
