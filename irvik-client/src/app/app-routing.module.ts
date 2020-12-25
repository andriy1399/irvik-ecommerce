import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { BagComponent } from './pages/bag/bag.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { StoreComponent } from './pages/store/store.component';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: 'home', component: HomeComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'bag', component: BagComponent},
  {path: 'favorites', component: FavoritesComponent},
  {path: 'store', component: StoreComponent},
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
