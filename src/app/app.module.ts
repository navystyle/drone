import {BrowserModule} from '@angular/platform-browser';
import {ApplicationRef, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {createInputTransfer, createNewHosts, removeNgStyles} from '@angularclass/hmr';
import {LayoutModule} from './layout/layout.module';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {CoreModule} from './core/core.module';

@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent
    ],
    imports: [
        BrowserModule.withServerTransition({appId: 'serverApp'}),
        AppRoutingModule,
        CoreModule,
        LayoutModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(public appRef: ApplicationRef) {
    }

    hmrOnInit(store: any) {
        if (!store || !store.state) {
            return;
        }
        // console.log('HMR store', store);
        // console.log('store.state.data:', store.state.data)
        // inject AppStore here and update it
        // this.AppStore.update(store.state)
        if ('restoreInputValues' in store) {
            store.restoreInputValues();
        }
        // change detection
        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    hmrOnDestroy(store: any) {
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // inject your AppStore and grab state then set it on store
        // var appState = this.AppStore.get()
        store.state = {data: 'yolo'};
        // store.state = Object.assign({}, appState)
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    hmrAfterDestroy(store: any) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
        // anything you need done the component is removed
    }
}
