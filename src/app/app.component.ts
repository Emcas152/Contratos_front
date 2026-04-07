import { ParameterService } from './services/parameter.service';
import { environment } from './../environments/environment';
import { ContratosService } from './services/contratos.service';

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import Swal from 'sweetalert2';

const opcionesPorTipo = [
  {
    tipo_proyecto: 'VIVO 4',
    torres: [
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' },
      { value: '3', label: 'Torre 3' }
    ]
  },
  {
    tipo_proyecto: 'VIVO 13',
    torres: [
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' }
    ]
  },
  {
    tipo_proyecto: 'BARRIO 5',
    torres: [
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' }
    ]
  },
  {
    tipo_proyecto: 'BARRIO DON BOSCO',
    torres: [
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' }
    ]
  },
  {
    tipo_proyecto: 'VILLA LUZ',
    torres: [
      { value: 'A', label: 'Torre A' },
      { value: 'B', label: 'Torre B' },
      { value: 'C', label: 'Torre C' },
      { value: 'D', label: 'Torre D' },
      { value: 'E', label: 'Torre E' },
      { value: 'F', label: 'Torre F' },
      { value: 'G', label: 'Torre G' },
      { value: 'H', label: 'Torre H' },
      { value: 'I', label: 'Torre I' },
      { value: 'J', label: 'Torre J' },
      { value: 'K', label: 'Torre K' }
    ]
  },
  {
    tipo_proyecto: 'GEMINIS 10',
    torres: [
      { value: '1', label: 'Torre Norte' },
      { value: '2', label: 'Torre Sur' }
    ]
  },
  {
    tipo_proyecto: 'VIAGGIO',
    torres: [{ value: 'UNICA', label: 'UNICA' }]
  },
  {
    tipo_proyecto: 'CENTRO VIVO',
    torres: [
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' }
    ]
  },
  {
    tipo_proyecto: 'NOVEM',
    torres: [{ value: 'UNICA', label: 'UNICA' }]
  },
  {
    tipo_proyecto: 'CANADAS',
    torres: [
      { value: 'CASA', label: 'Casa' },
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' }
    ]
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true }
    }
  ]
})
export class AppComponent implements OnInit {
  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;

  title = 'Contratos';

  // UI / state
  selected = 'option2';
  selectedTipo: string = '';
  torresOptions: { value: string; label: string }[] = [];
  selectedValue: string = '';
  selectedPlans: string = 'PLAN1'; // fijo: solo Internet
  termsAccepted = false;
  pdfGenerated = true;
  deseaAgregarTelefono = false;
  agregarServicioTelefono: boolean = false;
  opcionTelefono: string = '';
  isLoading: boolean = false;
  torreSelect = false;
  selectedTower: string = '';
  isFormCompleted = false;

  // Icons (se deja energia por si tu UI lo usa en otros lados; agua eliminado)
  EnergiaIconColor: any;
  EnergiaIcon: any;
  showEnergyInfo = false;

  // regex
  mobNumberPattern = '^[0-9]{8}$';
  mobNumberApartmentPattern = '^[0-9]*$';

  // lists
  public listProyectos: any[] = [];
  public listPlans: any[] = [];
  public listSexos: any[] = [];
  public listTipoDocumentos: any[] = [];
  public listEstadoCiviles: any[] = [];
  public listTipoApartamentos: any[] = [];
  public listTipoNacionalidades: any[] = [];

  // urls
  public baseUrl: string;
  public pdfUrl: string = '';
  public pdfUrlEnergia: string = '';

  // stepper labels
  steps: Array<{ label: string; completed: boolean }> = [
    { label: 'Paso 1', completed: false },
    { label: 'Paso 2', completed: false },
    { label: 'Paso 3', completed: false },
    { label: 'Paso 4', completed: false },
    { label: 'Paso 5', completed: false },
    { label: 'Paso 6', completed: false },
    { label: 'Paso 7', completed: false }
  ];

  /* Forms */
  firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup = Object.create(null);
  thirdFormGroup: FormGroup = Object.create(null);
  fourthFormGroup: FormGroup = Object.create(null);
  fifthFormGroup: FormGroup = Object.create(null);
  sixthFormGroup: FormGroup = Object.create(null);
  formFinal: FormGroup = Object.create(null);

  public formServicio: FormGroup = this._formBuilder.group({
    // Solo Internet y por defecto
    tipo_servicio: ['INTERNET', [Validators.required]],
    tabla0: [0, [Validators.required]],
    tabla1: [0, [Validators.required]],
    tabla2: [0, [Validators.required]],
    tabla3: [0, [Validators.required]],
    tabla4: [0, [Validators.required]],
    deseaAgregarTelefono: []
  });

  public formSolicitante: FormGroup = this._formBuilder.group({
    nombre: ['', [Validators.required]],
    nacionalidad: ['GUATEMALTEC', [Validators.required]],
    identificacion: ['', [Validators.required]],
    sexo: ['', [Validators.required]],
    tipo_documento: ['', [Validators.required]],
    edad: [
      '',
      [
        Validators.required,
        Validators.pattern(this.mobNumberApartmentPattern),
        Validators.min(18),
        Validators.max(100)
      ]
    ],
    nit: ['', [Validators.required]],
    celular: ['', [Validators.required, Validators.pattern(this.mobNumberPattern)]],
    estado_civil: ['SOLTER', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    fecha_traslado: ['', [Validators.required]],
    estado: ['NUEVO'],
    incluir_facturacion: ['']
  });

  public formFacturacion: FormGroup = this._formBuilder.group({
    nombre_factura: [''],
    nit_factura: ['']
  });

  public formProyecto: FormGroup = this._formBuilder.group({
    tipo_proyecto: [[Validators.required]],
    numero_apartamento: [
      '',
      [Validators.required, Validators.pattern(this.mobNumberApartmentPattern)]
    ],
    torre: ['', [Validators.required]],
    tipo_apartamento: ['', [Validators.required]]
  });

  /* Aceptar condiciones */
  checked = false;

  constructor(
    private _formBuilder: FormBuilder,
    private contratosService: ContratosService,
    private parameterService: ParameterService
  ) {
    this.firstFormGroup = this._formBuilder.group({
      tipo_proyecto: ['', Validators.required]
    });

    this.secondFormGroup = this._formBuilder.group({
      torre: ['', Validators.required],
      numero_apartamento: ['', [Validators.required]]
    });

    this.baseUrl = environment.baseUrl;

    this.getListadoTipoDocumentos();
    this.getListadoSexos();
    this.getListadoEstadosCiviles();
    this.getListadoTipoApartamentos();
    this.getListadoTipoNacionalidades();
  }

  // Helper para template
  getControl(name: string) {
    return this.formServicio.get(name) as FormControl;
  }

  ngOnInit(): void {
    this.thirdFormGroup = this._formBuilder.group({
      tipo_apartamento: ['', Validators.required]
    });

    /**
     * IMPORTANTE:
     * - Se elimina energia/agua de la selección
     * - Internet queda seleccionado por defecto
     */
    this.fourthFormGroup = this._formBuilder.group({
      internet: [true]
    });

    // Plan fijo por diseño (solo Internet)
    this.selectedPlans = 'PLAN1';

    // Si en algún punto se desmarca internet (si existiera UI), mantiene consistencia
    this.fourthFormGroup.valueChanges.subscribe((values) => {
      this.selectedPlans = values.internet ? 'PLAN1' : '';
      // Mantener tipo_servicio consistente
      if (values.internet) {
        this.formServicio.get('tipo_servicio')?.setValue('INTERNET', { emitEvent: false });
      }
    });

    // Cargar planes para mostrar cards/opciones
    this.getListadoPlanes();

    this.formFinal = this._formBuilder.group({
      termsAccepted: [false, Validators.requiredTrue]
    });

    // If there is a pending payload from a previous failed submission, restore it
    const pending = this.loadPendingPayload();
    if (pending) {
      // Support both shapes: nested `{datos, servicio, facturacion, ...}` and flat payload
      const solicitante = pending.datos || pending.solicitante || pending;
      const servicio = pending.servicio || pending;
      const fact = pending.facturacion || pending.facturacion || pending;

      try {
        if (solicitante) this.formSolicitante.patchValue(solicitante);
        if (servicio && this.formServicio) this.formServicio.patchValue(servicio);
        if (fact && this.formFacturacion) this.formFacturacion.patchValue(fact);

        // Project values
        if (pending.tipo_proyecto) this.firstFormGroup.patchValue({ tipo_proyecto: pending.tipo_proyecto });
        if (pending.torre) this.secondFormGroup.patchValue({ torre: pending.torre });
        if (pending.numero_apartamento) this.secondFormGroup.patchValue({ numero_apartamento: pending.numero_apartamento });
        if (pending.tipo_apartamento) this.thirdFormGroup.patchValue({ tipo_apartamento: pending.tipo_apartamento });

        // Terms
        if (pending.termsAccepted || pending.termsAccepted === true) this.formFinal.patchValue({ termsAccepted: true });

        console.log('Restored pending payload into forms.');
      } catch (e) {
        console.warn('Failed to restore pending payload into forms', e);
      }
    }
  }

  /* ====== Stepper ====== */
  nextStep(event?: any) {
    this.selectedValue =
      event && event.value ? event.value : this.firstFormGroup.get('tipo_proyecto')?.value;
    this.selectedTipo = this.thirdFormGroup.get('tipo_apartamento')?.value;

    if (this.selectedValue === 'VIAGGIO') {
      this.torreSelect = true;

      // Deshabilitar select torre y setear UNICA
      this.secondFormGroup.get('torre')?.disable();
      this.secondFormGroup.patchValue({ torre: 'UNICA' });

      this.stepper.next();
    } else {
      this.torreSelect = false;
      this.secondFormGroup.get('torre')?.enable();

      // (si mantienes icono de energía en UI por otros motivos)
      if (this.selectedValue === 'CENTRO VIVO' || this.selectedValue === 'NOVEM') {
        this.EnergiaIconColor = '#98989a';
        this.EnergiaIcon = 'cancel';
      } else {
        this.EnergiaIconColor = '#035C67';
        this.EnergiaIcon = 'task_alt';
      }

      setTimeout(() => this.stepper.next(), 200);
    }

    const opciones = opcionesPorTipo.find((o) => o.tipo_proyecto === this.selectedValue);
    if (opciones) this.torresOptions = opciones.torres;
  }

  private syncTorreControlState() {
    if (this.torreSelect) this.secondFormGroup.get('torre')?.disable();
    else this.secondFormGroup.get('torre')?.enable();
  }

  /* ====== Validaciones (solo internet) ====== */
  isFormValid(): boolean {
    return !!this.fourthFormGroup.get('internet')?.value;
  }

  isServiceSelected(): boolean {
    return !!this.fourthFormGroup.get('internet')?.value;
  }

  isBuildingSelected(): boolean {
    return this.firstFormGroup.get('tipo_proyecto')?.value !== '';
  }

  isContractTypeSelected(): boolean {
    return this.thirdFormGroup.get('tipo_apartamento')?.value !== '';
  }

  isSolicitanteFormCompleted(): boolean {
    const form = this.formSolicitante;
    return form.valid && form.dirty;
  }

  validateBeforeSend(): boolean {
    const basicFormsValid =
      this.formSolicitante.valid &&
      this.formServicio.valid &&
      this.firstFormGroup.valid &&
      this.secondFormGroup.valid &&
      this.thirdFormGroup.valid;

    const termsOk = this.formFinal.valid;

    // además, asegurar internet seleccionado
    const internetOk = this.isServiceSelected();

    return !!(basicFormsValid && termsOk && internetOk);
  }

  /* ====== Payload (sin agua/energia) ====== */
  buildBackendPayload(): any {
    const solicitante = this.formSolicitante.value || {};
    const servicio = this.formServicio.value || {};
    const fact = this.formFacturacion.value || {};
    const proyecto = this.firstFormGroup.value || {};
    const torre = this.secondFormGroup.value || {};
    const tipoApto = this.thirdFormGroup.value || {};
    const servicioAgua = (this as any).formServicioAgua ? (this as any).formServicioAgua.value : { servicio_agua: false };

    const datos = {
      // Include all solicitante fields so backend templates (Blade) receive expected variables like `edad`
      ...solicitante,
      celular: solicitante.celular || solicitante.telefono || '',
      numero_apartamento: this.secondFormGroup.get('numero_apartamento')?.value || solicitante.numero_apartamento || '',
      fecha_traslado: this.formatDate(solicitante.fecha_traslado || solicitante.fecha_traslado)
    };

    // Obtener detalles del plan seleccionado
    const planDetails = this.getSelectedPlanDetails();

    const payload: any = {
      datos,
      servicio: {
        tipo_servicio: servicio.tipo_servicio || 'INTERNET',
        velocidad: planDetails.velocidad || '',
        precio: planDetails.precio || '',
        tipo_plan: planDetails.tipoPlan || ''
      },
      tipo_plan: this.selectedPlans || 'PLAN1',
      tipo_proyecto: proyecto.tipo_proyecto ? { tipo_proyecto: proyecto.tipo_proyecto } : { tipo_proyecto: proyecto },
      torre: torre.torre ? { torre: torre.torre } : { torre: torre },
      tipo_apartamento: tipoApto.tipo_apartamento ? { tipo_apartamento: tipoApto.tipo_apartamento } : { tipo_apartamento: tipoApto },
      facturacion: {
        nombre_factura: fact.nombre_factura || '',
        nit_factura: fact.nit_factura || ''
      },
      servicio_agua: servicioAgua
    };

    return payload;
  }

  // Método auxiliar para obtener detalles del plan seleccionado
  private getSelectedPlanDetails(): { velocidad: string; precio: string; tipoPlan: string } {
    let velocidad = '';
    let precio = '';
    let tipoPlan = '';

    // Buscar en las tablas de planes
    const tabla0Value = this.formServicio.get('tabla0')?.value;
    const tabla1Value = this.formServicio.get('tabla1')?.value;
    const tabla2Value = this.formServicio.get('tabla2')?.value;

    if (tabla0Value && tabla0Value !== 0) {
      // Fiber Básico
      const plan = this.listPlans.find(p => p.code === 'basico');
      const option = plan?.options.find((o: any) => o.value === tabla0Value);
      if (option) {
        velocidad = option.label;
        precio = option.price;
        tipoPlan = plan.name;
      }
    } else if (tabla1Value && tabla1Value !== 0) {
      // Fiber Simétrico
      const plan = this.listPlans.find(p => p.code === 'simetrico');
      const option = plan?.options.find((o: any) => o.value === tabla1Value);
      if (option) {
        velocidad = option.label;
        precio = option.price;
        tipoPlan = plan.name;
      }
    } else if (tabla2Value && tabla2Value !== 0) {
      // Fiber Plus
      const plan = this.listPlans.find(p => p.code === 'plus');
      const option = plan?.options.find((o: any) => o.value === tabla2Value);
      if (option) {
        velocidad = option.label;
        precio = option.price;
        tipoPlan = plan.name;
      }
    }

    return { velocidad, precio, tipoPlan };
  }

  // Persist pending payload locally until backend returns success
  private pendingPayloadKey = 'contratos_pending_payload';

  private savePendingPayload(payload: any): void {
    try {
      localStorage.setItem(this.pendingPayloadKey, JSON.stringify(payload));
      console.log('Pending payload saved locally.');
    } catch (e) {
      console.warn('Could not save pending payload to localStorage', e);
    }
  }

  private clearPendingPayload(): void {
    try {
      localStorage.removeItem(this.pendingPayloadKey);
      console.log('Pending payload cleared from localStorage.');
    } catch (e) {
      console.warn('Could not clear pending payload', e);
    }
  }

  private loadPendingPayload(): any | null {
    try {
      const s = localStorage.getItem(this.pendingPayloadKey);
      if (!s) return null;
      return JSON.parse(s);
    } catch (e) {
      console.warn('Could not read pending payload', e);
      return null;
    }
  }

  private formatDate(value: any): string {
    if (!value && value !== 0) return '';

    if (typeof value === 'string') {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
      return value.trim();
    }

    if (value instanceof Date) return value.toISOString().split('T')[0];

    try {
      const s = JSON.stringify(value);
      const d = new Date(s);
      if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
    } catch {
      // ignore
    }
    return String(value);
  }

  fillRequiredDefaults(): void {
    // Forzar Internet siempre
    this.fourthFormGroup.get('internet')?.setValue(true, { emitEvent: false });
    this.selectedPlans = 'PLAN1';
    this.formServicio.get('tipo_servicio')?.setValue('INTERNET', { emitEvent: false });

    // Solicitante (defaults para pruebas)
    const s = this.formSolicitante;
    if (!s.get('nombre')?.value) s.get('nombre')?.setValue('Nombre Prueba');
    if (!s.get('nacionalidad')?.value) s.get('nacionalidad')?.setValue('GUATEMALTEC');
    if (!s.get('identificacion')?.value) s.get('identificacion')?.setValue('00000000');
    if (!s.get('sexo')?.value) s.get('sexo')?.setValue('M');
    if (!s.get('tipo_documento')?.value) s.get('tipo_documento')?.setValue('DPI');
    if (!s.get('edad')?.value) s.get('edad')?.setValue(30);
    if (!s.get('nit')?.value) s.get('nit')?.setValue('CF');
    if (!s.get('celular')?.value) s.get('celular')?.setValue('50123456');
    if (!s.get('estado_civil')?.value) s.get('estado_civil')?.setValue('SOLTER');
    if (!s.get('email')?.value) s.get('email')?.setValue('test@example.com');
    if (!s.get('fecha_traslado')?.value)
      s.get('fecha_traslado')?.setValue(new Date().toISOString().split('T')[0]);
    if (!s.get('estado')?.value) s.get('estado')?.setValue('NUEVO');

    // Términos
    this.formFinal.get('termsAccepted')?.setValue(true);

    // Proyecto / torre / apartamento
    if (!this.firstFormGroup.get('tipo_proyecto')?.value)
      this.firstFormGroup.get('tipo_proyecto')?.setValue('GEMINIS 10');

    if (!this.secondFormGroup.get('torre')?.value) this.secondFormGroup.get('torre')?.setValue('UNICA');
    if (!this.secondFormGroup.get('numero_apartamento')?.value)
      this.secondFormGroup.get('numero_apartamento')?.setValue('101');

    if (!this.thirdFormGroup.get('tipo_apartamento')?.value)
      this.thirdFormGroup.get('tipo_apartamento')?.setValue('UNICA');

    // Facturación
    const f = this.formFacturacion;
    if (!f.get('nombre_factura')?.value) f.get('nombre_factura')?.setValue('Empresa S.A.');
    if (!f.get('nit_factura')?.value) f.get('nit_factura')?.setValue('C/F');

    console.log('Defaults applied (testing).');
  }

  /* ====== Lists ====== */
  getListadoProyecto() {
    this.parameterService.getParameters('PRCON').subscribe({
      next: (response) => (this.listProyectos = response.data ?? []),
      error: (error) => console.error(error)
    });
  }

  getListadoPlanes() {
    // Planes (Internet) — no hay energía/agua
    this.listPlans = [
      {
        code: 'basico',
        name: 'Fiber Básico',
        image: '../assets/BÁSICO.svg',
        controlName: 'tabla0',
        disabled: false,
        options: [
          { value: '125', label: '125 Mbps', price: 'Q. 245.00' },
          { value: '225', label: '225 Mbps', price: 'Q. 295.00' },
          { value: '325', label: '325 Mbps', price: 'Q. 595.00' },
          { value: '525', label: '525 Mbps', price: 'Q. 795.00' },
          { value: '230', label: '230 Mbps', price: 'Q. 1,845.00' },
          { value: '330', label: '330 Mbps', price: 'Q. 2,145.00' }
        ]
      },
      {
        code: 'plus',
        name: 'Fiber plus',
        image: '../assets/FTTH PLUS.svg',
        controlName: 'tabla2',
        disabled: false,
        options: [
          { value: '30', label: '30 Mbps', price: 'Q. 445.00' },
          { value: '70', label: '70 Mbps', price: 'Q. 545.00' },
          { value: '110', label: '110 Mbps', price: 'Q. 795.00' },
          { value: '170', label: '170 Mbps', price: 'Q. 1,245.00' },
          { value: '230', label: '230 Mbps', price: 'Q. 1,845.00' },
          { value: '330', label: '330 Mbps', price: 'Q. 2,145.00' }
        ]
      },
      {
        code: 'simetrico',
        name: 'Fiber Simétrico',
        image: '../assets/SIMÉTRICO.svg',
        controlName: 'tabla1',
        disabled: false,
        options: [
          { value: '30', label: '30 Mbps', price: '$. 90.00' },
          { value: '50', label: '50 Mbps', price: '$. 110.00' },
          { value: '100', label: '100 Mbps', price: '$. 130.00' },
          { value: '200', label: '200 Mbps', price: '$. 250.00' }
        ]
      }
    ];
  }

  getListadoTipoDocumentos() {
    this.parameterService.getParameters('TIPDOC').subscribe({
      next: (response) => (this.listTipoDocumentos = response.data ?? []),
      error: (error) => console.error(error)
    });
  }

  getListadoSexos() {
    this.parameterService.getParameters('PRGEN').subscribe({
      next: (response) => (this.listSexos = response.data ?? []),
      error: (error) => console.error(error)
    });
  }

  getListadoEstadosCiviles() {
    this.parameterService.getParameters('STCIV').subscribe({
      next: (response) => (this.listEstadoCiviles = response.data ?? []),
      error: (error) => console.error(error)
    });
  }

  getListadoTipoApartamentos() {
    this.parameterService.getParameters('TAPTO').subscribe({
      next: (response) => (this.listTipoApartamentos = response.data ?? []),
      error: (error) => console.error(error)
    });
  }

  getListadoTipoNacionalidades() {
    this.parameterService.getParameters('TNAC').subscribe({
      next: (response) => (this.listTipoNacionalidades = response.data ?? []),
      error: (error) => console.error(error)
    });
  }

  /* ====== PDF ====== */
  generarPDF() {
    // Asegurar defaults de internet y tipo_servicio
    this.fourthFormGroup.get('internet')?.setValue(true, { emitEvent: false });
    this.formServicio.get('tipo_servicio')?.setValue('INTERNET', { emitEvent: false });
    this.selectedPlans = 'PLAN1';
    // Obtener el plan específico seleccionado
    let selectedPlanValue = '';
    if (this.formServicio.get('tabla0')?.value && this.formServicio.get('tabla0')?.value !== 0) {
      selectedPlanValue = this.formServicio.get('tabla0')?.value;
    } else if (this.formServicio.get('tabla1')?.value && this.formServicio.get('tabla1')?.value !== 0) {
      selectedPlanValue = this.formServicio.get('tabla1')?.value;
    } else if (this.formServicio.get('tabla2')?.value && this.formServicio.get('tabla2')?.value !== 0) {
      selectedPlanValue = this.formServicio.get('tabla2')?.value;
    }

    // Guardar el valor del plan seleccionado para enviarlo al backend
    this.selectedPlans = selectedPlanValue;

    // (Opcional) rellenar defaults en modo prueba
    this.fillRequiredDefaults();

    if (!this.validateBeforeSend()) {
      Swal.fire({
        icon: 'warning',
        title: 'Datos incompletos',
        text: 'Por favor complete los campos requeridos antes de generar el contrato.'
      });
      return;
    }

    const info: any = this.buildBackendPayload();
    console.log('Payload a enviar (JSON):', JSON.stringify(info, null, 2));
    // Persist pending payload locally so user input isn't lost if backend errors
    this.savePendingPayload(info);

    this.isLoading = true;

    // Enviar como JSON application/json
    this.contratosService.postContratos(info).subscribe(
      (response: any) => {
        setTimeout(() => (this.isLoading = false), 2000);

        this.pdfUrl =
          response.data.file_name === '' ? '' : `${this.baseUrl}/storage/${response.data.file_name}`;

        this.pdfUrlEnergia =
          response.data.file_name_energia === ''
            ? ''
            : `${this.baseUrl}/storage/${response.data.file_name_energia}`;

        Swal.fire(
          'Contrato(s) Generado(s)',
          `El contrato(s) con correlativo ${response.data.id} se generó correctamente. Presione los botones para visualizarlos y descargarlos en su equipo, también fueron enviados al correo electrónico ingresado!`,
          'success'
        );

        // Clear pending payload because request succeeded
        this.clearPendingPayload();

        this.stepper.next();
      },
      (error: any) => {
        this.isLoading = false;
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Algo salio mal! Los datos fueron guardados localmente y puede reintentar.'
        });
      }
    );
  }

  reenviarContrato() {
    const info = this.buildBackendPayload();
    info.reenviar = true;
    // Persist pending payload before re-send
    this.savePendingPayload(info);

    this.isLoading = true;

    // Reenvío como JSON application/json
    this.contratosService.postContratos(info).subscribe(
      (_response: any) => {
        this.isLoading = false;
        this.clearPendingPayload();
        Swal.fire('Contrato reenviado', 'El contrato fue reenviado al correo electrónico ingresado.', 'success');
      },
      (error: any) => {
        this.isLoading = false;
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo reenviar el contrato. Los datos se mantienen guardados localmente.'
        });
      }
    );
  }

  downloadPdf() {
    window.open(this.pdfUrl, '_blank');
  }

  downloadPdfEnergia() {
    window.open(this.pdfUrlEnergia, '_blank');
  }

  onBuildingSelectionChange(event: any) {
    if (event.value === 'VILLA LUZ') {
      this.stepper.next();
      this.stepper.selectedIndex = 3;
    } else {
      this.stepper.next();
    }
  }

  // Mantengo el método por compatibilidad si tu template aún lo llama, pero ya no debe usarse para energía/agua
  onRadioGroupChange(option: string, valor: string, tabla: string): void {
    // Forzar internet como tipo_servicio
    this.formServicio.get('tipo_servicio')?.setValue('INTERNET');
    this.formServicio.get(tabla)?.setValue(valor);

    // Mantener “solo una tabla activa” si tu UI lo necesita
    if (tabla === 'tabla0') {
      this.formServicio.get('tabla1')?.setValue(0);
      this.formServicio.get('tabla2')?.setValue(0);
    }
    if (tabla === 'tabla1') {
      this.formServicio.get('tabla0')?.setValue(0);
      this.formServicio.get('tabla2')?.setValue(0);
    }
    if (tabla === 'tabla2') {
      this.formServicio.get('tabla0')?.setValue(0);
      this.formServicio.get('tabla1')?.setValue(0);
    }
  }

  // ya no aplica selección múltiple de servicios; se deja solo para evitar errores en template viejo
  onRadioChange(_option: string): void {
    // No-op (Internet fijo)
  }

  viaggio(_selection: any) {
    // no-op
  }
}

