import { DataSource } from '@angular/cdk/collections';
import { ListDatabase } from './list-database';
import { MatPaginator} from '@angular/material/paginator'; 
import { MatSort } from '@angular/material/sort';
import { ListColumn } from './list-column.model';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ListDataSource<T> extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  _properties: string[];

  constructor(protected _listDatabase: ListDatabase<T>, protected _sort: MatSort, protected _paginator: MatPaginator, protected _columns: ListColumn[]) {
    super();
    this._properties = this._columns.filter(column => column.isModelProperty).map(column => column.property);
  }

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<T[]> {
    const displayDataChanges = [
      this._listDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    return merge(...displayDataChanges).pipe(
      map(() => this.getPaginatedData(this.getSortedData(this.filterData())))
    );
  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData(filteredData: T[]): T[] {
    const data = filteredData;
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      const sortByProperty = this._properties[this._sort.active];
      [propertyA, propertyB] = [a[sortByProperty], b[sortByProperty]];

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }

  filterData(): T[] {
    return this._listDatabase.data.slice().filter((model: T) => {
      const searchStr = this._properties.map(property => model[property]).join(' ').toLowerCase();
      return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
    });
  }

  getPaginatedData(data) {
    const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
    return data.splice(startIndex, this._paginator.pageSize);
  }
}
