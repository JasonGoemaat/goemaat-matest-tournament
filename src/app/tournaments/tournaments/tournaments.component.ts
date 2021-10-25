import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { TournamentService, MyRouteData } from 'src/app/services/tournament.service';
import { tournamentReset } from 'src/app/models/reset';
import { Tournament } from 'src/app/models/tournament';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss']
})
export class TournamentsComponent implements OnInit, OnDestroy {
  tournamentId: string = '';
  data$: Observable<MyRouteData>
  paramMap : Subscription | undefined = undefined;

  constructor(
    public route: ActivatedRoute,
    public service: TournamentService,
    public authService: AuthService,
    public router: Router,
    ) {
    (window as any).cTournaments = this;
    this.data$ = this.service.getForParams(this.route.paramMap).pipe(tap(x => {
      console.log('getForParams returned:', x);
      (window as any).t = x;
    }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  resetTournament(tournamentId: string): void {
    if (!confirm(`ARE YOU ABSOLUTELY SURE?\r\nThis will reset tournament "${tournamentId}"!`)) {
      return;
    }

    this.service.setTournament(tournamentId, tournamentReset).then(x => console.log('RESET!', x)).catch((err: any) => console.error(err));
  }

  signIn(): void {
    this.authService.signIn();
  }

  signOut(): void {
    this.authService.signOut();
  }

  copyToClipboard(tournament: Tournament) {
    navigator.clipboard.writeText(JSON.stringify(tournament));
  }
}
