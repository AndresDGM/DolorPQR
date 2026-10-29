import { DatePipe } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/application/auth';
import { GetPqrByCodigoUseCase } from '../../../core/application/usecases/get-pqr-by-codigo.usecase';
import { GetPqrHistorialUseCase } from '../../../core/application/usecases/get-pqr-historial.usecase';
import {
  BadgeEstadoComponent,
  BadgeTipoComponent,
  EmptyStateComponent,
  LoadingSpinnerComponent,
} from '../../components/shared';
import { VmConsultaPqr } from '../../interfaces/vm-consulta-pqr.interface';

/**
 * Página de consulta de estado y trazabilidad de una PQR por su código único.
 *
 * @architecture Clean Architecture
 * @layer Presentation
 */
@Component({
  selector: 'app-consulta-pqr',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    RouterLink,
    BadgeEstadoComponent,
    BadgeTipoComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  templateUrl: './consulta-pqr.component.html',
  styleUrl: './consulta-pqr.component.scss',
})
export class ConsultaPqrComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private getPqrByCodigoUseCase = inject(GetPqrByCodigoUseCase);
  private getPqrHistorialUseCase = inject(GetPqrHistorialUseCase);
  authService = inject(AuthService);

  codigoControl = new FormControl('', [Validators.required, Validators.minLength(5)]);

  state = signal<VmConsultaPqr>({
    loading: false,
    searched: false,
    pqr: null,
    history: [],
    error: null,
  });

  ngOnInit(): void {
    const codeParam = this.route.snapshot.queryParamMap.get('codigo');
    if (codeParam) {
      this.codigoControl.setValue(codeParam);
      this.searchPqr(codeParam);
    }
  }

  onSearch(): void {
    const code = this.codigoControl.value?.trim();
    if (!code) return;
    this.searchPqr(code);
  }

  private searchPqr(codigo: string): void {
    this.state.set({
      loading: true,
      searched: true,
      pqr: null,
      history: [],
      error: null,
    });

    this.getPqrByCodigoUseCase.execute(codigo).subscribe({
      next: (pqr) => {
        this.getPqrHistorialUseCase.execute(pqr.idPqr).subscribe({
          next: (history) => {
            this.state.set({
              loading: false,
              searched: true,
              pqr,
              history,
              error: null,
            });
          },
          error: () => {
            this.state.set({
              loading: false,
              searched: true,
              pqr,
              history: [],
              error: null,
            });
          },
        });
      },
      error: (err) => {
        this.state.set({
          loading: false,
          searched: true,
          pqr: null,
          history: [],
          error:
            err.message ||
            `No se encontró ninguna solicitud registrada con el código "${codigo}".`,
        });
      },
    });
  }

}
