import { Injectable } from '@angular/core';
import { ReplaySubject, Subject } from 'rxjs';

export interface History {
  key: string;
  encoded: string;
  decoded: string;
};

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  historyList: History[] = [];
  historyListSubject: Subject<History[]> =  new ReplaySubject<History[]>();

  constructor() {
    this.load();
  }

  load() {
    const historyData = localStorage.getItem('history');
    if (!historyData) {
      this.historyListSubject.next(this.historyList);
      return;
    }
    this.historyList = JSON.parse(historyData);
    this.historyListSubject.next(this.historyList);
  }

  save() {
    localStorage.setItem('history', JSON.stringify(this.historyList));
    this.historyListSubject.next(this.historyList);
  }

  addHistory(encoded: string, decoded: string): string {
    const key = String(new Date().getTime());
    this.historyList.unshift({
      key,
      encoded: encoded.toLowerCase(),
      decoded: decoded.toLowerCase(),
    });
    this.save();
    return key;
  }

  removeHistory(key: string) {
    this.historyList = this.historyList.filter((e) => (e.key !== key));
    this.save();
  }

  findHistory(encoded: string, decoded: string): string|undefined {
    return this.historyList.find((e) => (e.encoded === encoded.toLowerCase() && e.decoded === decoded.toLowerCase()))?.key;
  }

  getCandidates(word: string, reverse: boolean): History[] {
    word = word.toLowerCase();
    return this.historyList.filter((e) => {
      return reverse
        ? e.decoded.startsWith(word)
        : e.encoded.startsWith(word);
    });
  }
}
