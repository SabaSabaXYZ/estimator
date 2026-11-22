import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Injector, Signal } from "@angular/core";
import { map, Observable, switchMap } from "rxjs";
import { toObservable } from '@angular/core/rxjs-interop';

export class SignalDataSource<T> extends DataSource<T> {

  private readonly data$!: Observable<T[]>;

  constructor(private initialData: Signal<T[]>, private injector: Injector) {
    super();
    this.data$ = toObservable(this.initialData, { injector: this.injector });
  }

  override connect(collectionViewer: CollectionViewer): Observable<readonly T[]> {
    return collectionViewer.viewChange.pipe(
      switchMap(({ start, end }) => this.data$.pipe(
        map(data => data.slice(start, end))
      ))
    );
  }

  override disconnect(): void {
    // Do nothing
  }

}
