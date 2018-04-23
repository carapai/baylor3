import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCardModule, MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatMenuModule,
  MatPaginatorModule, MatSortModule,
  MatTableModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [MatButtonModule,
    MatToolbarModule,
    MatTableModule,
    MatMenuModule,
    MatCardModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class MaterialAppModule {
}
