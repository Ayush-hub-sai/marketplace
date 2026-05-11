import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomePageComponent } from './features/home/pages/home-page.component';
import { SearchPageComponent } from './features/search/pages/search-page.component';
import { ServiceDetailsComponent } from './features/service-details/service-details.component';
import { BookingComponent } from './features/booking/booking.component';
import { UserDashboardComponent } from './features/user-dashboard/user-dashboard.component';
import { ProviderDashboardComponent } from './features/provider-dashboard/provider-dashboard.component';
import { ChatComponent } from './features/chat/chat.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';


export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            {
                path: '',
                component: HomePageComponent
            },
            {
                path: 'search',
                component: SearchPageComponent
            },
            {
                path: 'service/:id',
                component: ServiceDetailsComponent
            },
            {
                path: 'booking',
                canActivate: [AuthGuard],
                component: BookingComponent
            },
            {
                path: 'user-dashboard',
                canActivate: [AuthGuard],
                component: UserDashboardComponent
            },
            {
                path: 'provider-dashboard',
                canActivate: [AuthGuard, RoleGuard],
                data: { roles: ['provider'] },
                component: ProviderDashboardComponent
            },
            {
                path: 'chat',
                canActivate: [AuthGuard],
                component: ChatComponent
            }
        ]
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
