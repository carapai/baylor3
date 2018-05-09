import {NgModule} from '@angular/core';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {
  MatButtonModule,
  MatCardModule, MatDatepickerModule, MatDialogModule, MatExpansionModule, MatFormFieldModule,
  MatIconModule, MatInputModule, MatListModule,
  MatMenuModule, MatOptionModule,
  MatPaginatorModule, MatSelectModule, MatSidenavModule, MatSnackBarModule, MatSortModule,
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
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatSidenavModule,
    MatDialogModule,
    MatListModule,
    MatSnackBarModule,
    MatExpansionModule
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
    MatExpansionModule
  ]
})
export class MaterialAppModule {
}
