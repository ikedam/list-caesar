import { Component, ElementRef, ViewChild } from '@angular/core';

interface Caesar {
  shift: number;
  word: string;
  raw: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('wordInput') wordInput!: ElementRef;
  word = '';
  reverse = false;
  keyboardSize = 2;

  get letters(): string[] {
    const ret: string[] = [];
    for(let i = 0; i < 26; ++i) {
      ret.push(String.fromCharCode('a'.charCodeAt(0) + i));
    }
    return ret;
  }

  input(letter: string) {
    const e = this.wordInput.nativeElement;
    //this.word = this.word.substring(0, e.selectionStart) + letter + this.word.substring(e.selectionEnd);
    //this.nextWordInputCursor = e.selectonStart + letter.length;
    const selectionStart = e.selectionStart;
    const selectionEnd = e.selectionEnd;
    e.value = e.value.substring(0, selectionStart) + letter + e.value.substring(selectionEnd);
    e.selectionStart = e.selectionEnd = selectionStart + letter.length;
    e.dispatchEvent(new InputEvent('input'));
  }

  calcNewOffset(offset: number, shift: number, reverse: boolean): {fixed: number, raw: number} {
    if (reverse) {
      return this.calcNewOffsetReverse(offset, shift);
    }
    const newOffset = offset - shift;
    let raw = (newOffset + 26) % 26;
    let fixed = newOffset;
    while (fixed < 0) {
      fixed = fixed + 26;
      fixed = fixed - 1;
    }
    return {
      fixed,
      raw,
    };
  }

  calcNewOffsetReverse(offset: number, shift: number): {fixed: number, raw: number} {
    const newOffset = offset + shift;
    let raw = newOffset % 26;
    let fixed = newOffset;
    while (fixed >= 26) {
      fixed = fixed - 26;
      fixed = fixed + 1;
    }
    return {
      fixed,
      raw,
    };
  }

  caesar(base: string, shift: number, reverse: boolean): Caesar {
    let raw = base;
    let fixed = base;
    for(let idx = 0; idx < base.length; ++idx) {
      const c = base.charCodeAt(idx);
      // A: 0x41
      // Z: 0x5a
      // a: 0x61
      // z: 0x7a
      if (0x41 <= c && c <= 0x5a) {
        const newOffset = this.calcNewOffset(c - 0x41, shift, reverse);
        const rawLetter = String.fromCharCode(0x41 + newOffset.raw);
        const fixedLetter = String.fromCharCode(0x41 + newOffset.fixed);
        raw = raw.substring(0, idx) + rawLetter + raw.substring(idx + 1);
        fixed = fixed.substring(0, idx) + fixedLetter + fixed.substring(idx + 1);
      } else if(0x61 <= c && c <= 0x7a) {
        const newOffset = this.calcNewOffset(c - 0x61, shift, reverse);
        const rawLetter = String.fromCharCode(0x41 + newOffset.raw);
        const fixedLetter = String.fromCharCode(0x61 + newOffset.fixed);
        raw = raw.substring(0, idx) + rawLetter + raw.substring(idx + 1);
        fixed = fixed.substring(0, idx) + fixedLetter + fixed.substring(idx + 1);
      }
    }
    return {
      shift: shift,
      word: fixed,
      raw: raw,
    };
  }

  get caesarList(): Caesar[] {
    if (this.word === '') {
      return [];
    }
    const ret: Caesar[] = [];
    for (let shift = 0; shift < 26; ++shift) {
      ret.push(this.caesar(this.word, shift, this.reverse));
    }
    return ret;
  }
}
