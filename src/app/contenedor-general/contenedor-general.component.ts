import {ChangeDetectorRef, Component, OnInit,OnDestroy } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';


@Component({
  selector: 'app-contenedor-general',
  templateUrl: './contenedor-general.component.html',
  styleUrls: ['./contenedor-general.component.scss']
})
export class ContenedorGeneralComponent implements OnInit,OnDestroy {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  fillerNav=['Pre-requisitos','Información General'];
  fillerContent=[ 'las panox versión 1', 'las panox versión 2' ];

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 0px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
