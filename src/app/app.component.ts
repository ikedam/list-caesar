import { Component } from '@angular/core';

interface Caesar {
  shift: number;
  word: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  word = '';

  caesar(base: string, shift: number): string {
    for(let idx = 0; idx < base.length; ++idx) {
      const c = base.charCodeAt(idx);
      // A: 0x41
      // Z: 0x5a
      // a: 0x61
      // z: 0x7a
      if (0x41 <= c && c <= 0x5a) {
        const codeDiff = c - 0x41;
        const newCodeDiff = (codeDiff + shift) % 26;
        const newLetter = String.fromCharCode(0x41 + newCodeDiff);
        base = base.substring(0, idx) + newLetter + base.substring(idx + 1);
      } else if(0x61 <= c && c <= 0x7a) {
        const codeDiff = c - 0x61;
        const newCodeDiff = (codeDiff + shift) % 26;
        const newLetter = String.fromCharCode(0x61 + newCodeDiff);
        base = base.substring(0, idx) + newLetter + base.substring(idx + 1);
      }
    }
    return base;
  }

  get caesarList(): Caesar[] {
    if (this.word === '') {
      return [];
    }
    const ret: Caesar[] = [];
    for (let shift = 0; shift < 26; ++shift) {
      ret.push({
        shift: shift,
        word: this.caesar(this.word, shift),
      });
    }
    return ret;
  }
}
