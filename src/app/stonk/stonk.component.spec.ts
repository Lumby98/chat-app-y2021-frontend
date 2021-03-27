import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StonkComponent } from './stonk.component';

describe('StonkComponent', () => {
  let component: StonkComponent;
  let fixture: ComponentFixture<StonkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StonkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StonkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
