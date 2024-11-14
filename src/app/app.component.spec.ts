import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { WeatherService } from './weather.service';
import { environment } from '../environments/environment'; 

describe('AppComponent', () => {
  let httpMock: HttpTestingController;
  let service: WeatherService;
  let fixture: any;
  let app: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatPaginatorModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        WeatherService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should have as title "ace-interview-exercise"', () => {
    expect(app.title).toEqual('ace-interview-exercise');
  });

  it('should render title', () => {
    fixture.detectChanges();

    const stationsRequest = httpMock.expectOne(`${environment.apiUrl}?limit=100`);
    stationsRequest.flush({
      features: [
        { properties: { stationIdentifier: '123', name: 'Station 1' } },
        { properties: { stationIdentifier: '124', name: 'Station 2' } }
      ]
    });

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.header-text').textContent).toContain('Alaska Air - Angular Interview Exercise');
  });

  it('should fetch weather data from the API', () => {
    const dummyWeatherData = {
      features: [
        { properties: { temperature: { value: 295.15 } } }
      ]
    };

    const dummyStations = {
      features: [
        { properties: { stationIdentifier: '123', name: 'Station 1' } },
        { properties: { stationIdentifier: '124', name: 'Station 2' } }
      ]
    };

    app.loadStations();

    const stationsRequest = httpMock.expectOne(`${environment.apiUrl}?limit=100`); 
    expect(stationsRequest.request.method).toBe('GET');
    stationsRequest.flush(dummyStations); 

    app.onSelectStation(dummyStations.features[0]);

    const temperatureRequest = httpMock.expectOne(`${environment.apiUrl}/123/observations?limit=1`);
    expect(temperatureRequest.request.method).toBe('GET');
    temperatureRequest.flush(dummyWeatherData);

    expect(app.temperature).toBe('295.15 °F');
  });
});
