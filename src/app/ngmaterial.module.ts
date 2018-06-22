import {NgModule} from '@angular/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {
  MatButtonModule,
  MatCardModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatOptionModule,
  MatPaginatorModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatGridListModule,
  MatAutocompleteModule
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
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSidenavModule,
    MatDialogModule,
    MatListModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatGridListModule,
    MatAutocompleteModule
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
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSidenavModule,
    MatDialogModule,
    MatListModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatGridListModule,
    MatAutocompleteModule
  ]
})
export class MaterialAppModule {
}
