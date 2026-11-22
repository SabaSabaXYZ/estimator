import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Injector, Signal } from "@angular/core";
import { MatSort, Sort } from "@angular/material/sort";
import { map, Observable, of, startWith, switchMap } from "rxjs";
import { toObservable } from '@angular/core/rxjs-interop';

function hasProperty<T extends object>(data: T, key: string): key is (keyof T & string) {
  return Object.hasOwn(data, key);
}

function isNumeric(value: unknown): value is number {
  return Number.isFinite(value);
}

function sortData<T extends object>(data: T[], sort: Sort): T[] {
  if (data.length === 0 || sort.direction === '') {
    return data;
  }
  const firstItem: T = data[0];
  if (!hasProperty(firstItem, sort.active)) {
    return data;
  }
  const propertyName: keyof T = sort.active;
  if (!Number.isFinite(firstItem[propertyName])) {
    return data;
  }
  return [...data].sort((a, b) => {
    const firstValue: T[keyof T] = a[propertyName];
    const secondValue: T[keyof T] = b[propertyName];
    if (isNumeric(firstValue) && isNumeric(secondValue)) {
      return sort.direction === 'asc' ? firstValue - secondValue : secondValue - firstValue;
    }
    return 0;
  });
}

export class SignalDataSource<T extends object> extends DataSource<T> {

  private readonly data$!: Observable<T[]>;
  private sort: MatSort | null = null;

  constructor(private initialData: Signal<T[]>, private injector: Injector) {
    super();
    this.data$ = toObservable(this.initialData, { injector: this.injector });
  }

  override connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
    return collectionViewer.viewChange.pipe(
      switchMap(({ start, end }) => this.data$.pipe(
        map(data => data.slice(start, end)),
        switchMap(data => this.sort?.sortChange.pipe(
          startWith(null),
          map(sort => sort !== null ? sortData(data, sort) : data)
        ) ?? of(data))
      ))
    );
  }

  override disconnect(): void {
    // Do nothing
  }

  set matSort(value: MatSort) {
    this.sort = value;
  }

}
