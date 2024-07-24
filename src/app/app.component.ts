import { ParameterService } from './services/parameter.service';
import { environment } from './../environments/environment';
import { ContratosService } from './services/contratos.service';

import { Component, OnInit,ViewChild  } from '@angular/core';
import { MatHorizontalStepper } from '@angular/material/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { FormControl } from '@angular/forms';
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
      { value: '2', label: 'Torre 2' },
    
    ]
  },
  {
    tipo_proyecto: 'BARRIO 5',
    torres: [
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' },
    
    ]
  },
  {
    tipo_proyecto: 'BARRIO DON BOSCO',
    torres: [
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' },
    
    ]
  },
  {

    tipo_proyecto: 'VILLA LUZ',
    torres: [
      { value: '1', label: 'Torre 1' },
      { value: '2', label: 'Torre 2' }
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
    torres: [
      { value: 'UNICA', label: 'UNICA' },
     
    
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
      useValue: {showError: true},
    },
  ], 
})

export class AppComponent implements OnInit {

  selectedOption: string = '';
  selectedRadioButton: string = '';
  
  // FormControl for each radio group



  onRadioGroupChange(option: string,valor:string, tabla:string): void {
    this.formServicio.get('tipo_servicio')?.setValue(option);
    this.formServicio.get(tabla)?.setValue(valor);


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
    console.log(this.formServicio.get('tabla1')?.value);
    console.log(this.formServicio.get('tabla2')?.value);
    console.log(this.formServicio.get('tabla0')?.value);
    console.log(this.formServicio.get('tipo_servicio')?.value);
  }

   onRadioChange(option: string): void {
    if (this.selectedRadioButton !== '' && this.selectedRadioButton !== option) {
      this.selectedRadioButton = ''; // Restablece la selección previa
      this.selectedOption = ''; // Desbloquea la opción previa

      // Resetear los controles de los radio buttons
      this.formServicio.get('tabla0')?.reset();
      this.formServicio.get('tabla1')?.reset();
      this.formServicio.get('tabla2')?.reset();
    }
    this.selectedRadioButton = option; // Establece la nueva selección
    this.selectedOption = option;
    console.log('Form value after change:', this.formServicio.get('tipo_servicio')?.value);
    console.log('Form value after change:', this.formServicio.get('tabla0')?.value);
    console.log('Form value after change:', this.formServicio.get('tabla1')?.value);
    console.log('Form value after change:', this.formServicio.get('tabla2')?.value);
  } 

  @ViewChild(MatHorizontalStepper) stepper!: MatHorizontalStepper;
  selected = 'option2';
  selectedTipo: string = '';
  torresOptions: { value: string, label: string }[] = [];
  selectedValue: string = '';
  isRadioSelected: boolean = false;
  firstFormGroup: FormGroup ;

  showEnergyInfo = false;

  thirdFormGroup: FormGroup = Object.create(null);
  fourthFormGroup: FormGroup = Object.create(null);
  fifthFormGroup: FormGroup = Object.create(null);
  sixthFormGroup: FormGroup = Object.create(null);
  AguaFormGroup: FormGroup = Object.create(null);
  formFinal: FormGroup = Object.create(null);
  isOptional = false;
  isEditable = false;
  isLinear = false;
  aguaIcon = 'task_alt';
  public aguaIconColor  = '#035C67';
  mobNumberPattern = "^[0-9]{8}$";
  mobNumberApartmentPattern = "^[0-9]*$";
  public listProyectos: any[] = [];
  public listPlans: any[] = [];
  public listSexos: any[] = [];
  public listTipoDocumentos: any[] = [];
  public listEstadoCiviles: any[] = [];
  public listTipoApartamentos: any[] = [];
  public listTipoNacionalidades: any[] = [];
  public baseUrl: string;
  public pdfUrl:string = '';
  public pdfUrlEnergia:string = '';
  public pdfUrlAgua:string = '';
  termsAccepted = false;
  selectedPlans: string = '';
  pdfGenerated  = true;
  deseaAgregarTelefono = false;
  agregarServicioTelefono: boolean = false;
  opcionTelefono: string = "";
  isLoading: boolean = false;
  torreSelect = false;
  selectedTower: string = '';
  isFormCompleted = false;


  steps: Array<{label: string, completed: boolean}> = [
    {label: 'Paso 1', completed: false},
    {label: 'Paso 2', completed: false},
    {label: 'Paso 3', completed: false},
    {label: 'Paso 4', completed: false},
    {label: 'Paso 5', completed: false},
    {label: 'Paso 6', completed: false},
    {label: 'Paso 7', completed: false},
  ];





  /* Aceptar condiciones */
  checked = false;
  nextStep() {
     this.selectedValue = this.firstFormGroup.get('tipo_proyecto')?.value;
     this.selectedTipo = this.thirdFormGroup.get('tipo_apartamento')?.value;

   
    
    if (this.selectedValue === 'VIAGGIO' ) {
      this.aguaIcon = "cancel";
      this.aguaIconColor = '#98989a';
     // this.stepper.selectedIndex = 1;
     this.torreSelect = true;
     // this.stepper.steps.toArray()[1].editable = false;
      this.secondFormGroup.patchValue({
        torre: 'UNICA'
      });
        this.stepper.next();
 
      
    } else {
      if(this.selectedValue === 'VILLA LUZ'){
        this.aguaIconColor = '#98989a';
        this.aguaIcon = "cancel";
      }
      else{
        this.aguaIconColor = '#035C67';
        this.aguaIcon = "task_alt";
      }


      
     
      this.torreSelect = false;
      setTimeout(() => {
        this.stepper.next();
      }, 200);
    }
    
    const opciones = opcionesPorTipo.find(opciones => opciones.tipo_proyecto === this.selectedValue);
    if (opciones) {
      this.torresOptions = opciones.torres;
      
    }

}



public formServicio: FormGroup = this._formBuilder.group({
  tipo_servicio: ['', [Validators.required]],
  tabla0: [0, [Validators.required]],
  tabla1: [0, [Validators.required]],
  tabla2: [0, [Validators.required]],
  tabla3: [0, [Validators.required]],
  tabla4: [0,[Validators.required]],
  deseaAgregarTelefono: [],
});

public formServicioAgua: FormGroup = this._formBuilder.group({
  servicio_agua: ['', [Validators.required]]
});






isFormValid(): boolean {
  return (
    this.fourthFormGroup.get('energia')?.value ||
    this.fourthFormGroup.get('internet')?.value ||
    this.fourthFormGroup.get('agua')?.value
  );
}

isServiceSelected(): boolean {
  const { agua, energia, internet } = this.fourthFormGroup.value;
  return agua || energia || internet;
}

public secondFormGroup = this._formBuilder.group({
  torre: ['', Validators.required],
  numero_apartamento: ['', [Validators.required]],
});

isBuildingSelected(): boolean {
  return this.firstFormGroup.get('tipo_proyecto')?.value !== '';
}

isContractTypeSelected(): boolean {
  return this.thirdFormGroup.get('tipo_apartamento')?.value !== '';
}


public formSolicitante: FormGroup = this._formBuilder.group({
  nombre: ['', [Validators.required]],
  nacionalidad: ['GUATEMALTEC', [Validators.required]],
  identificacion: ['', [Validators.required]],
  sexo: ['', [Validators.required]],
  tipo_documento: ['', [Validators.required]],
  edad: ['', [Validators.required, Validators.pattern(this.mobNumberApartmentPattern), Validators.min(18), Validators.max(100)]],
  nit: ['', [Validators.required]],
  celular: ['', [Validators.required, Validators.pattern(this.mobNumberPattern)]],
  estado_civil: ['SOLTER', [Validators.required]],
  email: ['', [Validators.required, Validators.email]],
  fecha_traslado: ['', [Validators.required]],
  estado: ['NUEVO'],
 
  incluir_facturacion: [''],
});



public formFacturacion: FormGroup = this._formBuilder.group({
  nombre_factura: [''],
  nit_factura: [''],
});
  
isSolicitanteFormCompleted(): boolean {
  const form = this.formSolicitante;
  return form.valid && form.dirty;
}

  
  title = 'Contratos';

  constructor(private _formBuilder: FormBuilder,private contratosService: ContratosService,
    private parameterService: ParameterService) {
    this.firstFormGroup = this._formBuilder.group({
      tipo_proyecto: ['', Validators.required]
    });
    this.baseUrl = environment.baseUrl;

 
      this.getListadoTipoDocumentos();
      this.getListadoSexos();
      this.getListadoEstadosCiviles();
      this.getListadoTipoApartamentos();
      this.getListadoTipoNacionalidades();
  }

  ngOnInit(): void {
    
   

    this.thirdFormGroup = this._formBuilder.group({
      tipo_apartamento: ['', Validators.required],
    });

    this.fourthFormGroup = this._formBuilder.group({
      agua: [''] ,
      energia: [''], 
      internet: [''] 
    });

    this.fourthFormGroup.get('energia')?.valueChanges.subscribe(value => {
      this.showEnergyInfo = value;
    });

    this.fourthFormGroup.valueChanges.subscribe((values) => {
      if (values.internet && !values.agua && !values.energia) {
        this.selectedPlans = 'PLAN1';
      } else if (!values.internet && values.agua && values.energia) {
        this.selectedPlans = 'PLAN2';
      } else if (values.internet && values.agua && values.energia) {
        this.selectedPlans = 'PLAN3';
      } else if (values.agua && !values.internet && !values.energia) {
        this.selectedPlans = 'PLAN4';
      } else if (values.energia && !values.agua && !values.internet) {
        this.selectedPlans = 'PLAN5';
      } else if (values.energia && !values.agua && values.internet) {
        this.selectedPlans = 'PLAN7';
      } else if (!values.energia && values.agua && values.internet) {
        this.selectedPlans = 'PLAN6';
      } else {
        // handle the case where no plan is selected
      }
      
    });


   


   
    this.formFinal = this._formBuilder.group({
      termsAccepted: [false, Validators.requiredTrue],
    });

  }
  public formProyecto: FormGroup = this._formBuilder.group({
    tipo_proyecto: [[Validators.required]],
   numero_apartamento: ['', [Validators.required, Validators.pattern(this.mobNumberApartmentPattern)]], 
    torre: ['', [Validators.required]],
    tipo_apartamento: ['', [Validators.required]],
   /*  tipo_plan: ['', [Validators.required]], */
  });

  viaggio(selection: any){
   
  }




  getListadoProyecto(){
    
    this.parameterService.getParameters('PRCON').subscribe({
      next: (response) => {
        this.listProyectos = response.data ?? [];
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
       
      }
    });
  }

  getListadoPlanes(){
    
    this.parameterService.getParameters('PRPLAN').subscribe({
      next: (response) => {
        this.listPlans = response.data ?? [];
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
       
      }
    });
  }

  getListadoTipoDocumentos(){
   
    this.parameterService.getParameters('TIPDOC').subscribe({
      next: (response) => {
        this.listTipoDocumentos = response.data ?? [];
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        
      }
    });
  }

  getListadoSexos(){
  
    this.parameterService.getParameters('PRGEN').subscribe({
      next: (response) => {
        this.listSexos = response.data ?? [];
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
       
      }
    });
  }

  getListadoEstadosCiviles(){
   
    this.parameterService.getParameters('STCIV').subscribe({
      next: (response) => {
        this.listEstadoCiviles = response.data ?? [];
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
      
      }
    });
  }

  getListadoTipoApartamentos(){
   
    this.parameterService.getParameters('TAPTO').subscribe({
      next: (response) => {
        this.listTipoApartamentos = response.data ?? [];
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
      
      }
    });
  }

  getListadoTipoNacionalidades(){
   
    this.parameterService.getParameters('TNAC').subscribe({
      next: (response) => {
        this.listTipoNacionalidades = response.data ?? [];
      },
      error: (error) => {
        console.error(error);
      },
      complete: () => {
        
      }
    });
  }

  generarPDF() {
    console.log(this.selectedPlans);
    console.log(this.secondFormGroup.get('torre')?.value);
    console.log(this.secondFormGroup.get('numero_apartamento')?.value);
    console.log(this.firstFormGroup.get('tipo_proyecto')?.value);
    console.log(this.thirdFormGroup.get('tipo_apartamento')?.value);
    console.log(this.formServicioAgua.get('servicio_agua')?.value);
    console.log(this.formServicio.get('tabla1')?.value);
    console.log(this.formServicio.get('tipo_servicio')?.value);

    let info = {
      datos: this.formSolicitante.value,
      servicio: this.formServicio.value,
      tipo_plan: this.selectedPlans,
      tipo_proyecto : this.firstFormGroup.value,
      torre: this.secondFormGroup.value,
      tipo_apartamento: this.thirdFormGroup.value,
      facturacion: this.formFacturacion.value,
      servicio_agua: this.formServicioAgua.value
      
    }
    this.isLoading = true;

    this.contratosService.postContratos(info).subscribe(response => {
     
      setTimeout(() => {
        // Lógica de la función
    
        // Una vez que la función se complete, oculta el spinner
        this.isLoading = false;
      }, 2000);
      //console.log(`${this.baseUrl}/storage/app/public/${response.data.file_name}`);
      this.pdfUrl =  response.data.file_name === '' ? '' : `${this.baseUrl}/storage/${response.data.file_name}`;
      this.pdfUrlEnergia = response.data.file_name_energia === '' ? '' : `${this.baseUrl}/storage/${response.data.file_name_energia}`;
      this.pdfUrlAgua = response.data.file_name_agua === '' ? '' : `${this.baseUrl}/storage/${response.data.file_name_agua}`;
      Swal.fire('Contrato(s) Generado(s)',
      `El contrato(s) con correlativo ${response.data.id} se generó correctamente. Presione los botones para visualizarlos y descargarlos en su equipo, también fueron enviados al correo electrónico ingresado!`, 'success');
    
      this.stepper.next();
    }, error => {
    
        // Lógica de la función
    
        // Una vez que la función se complete, oculta el spinner
        this.isLoading = false;
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Algo salio mal!'
      })
    });

  }
  downloadPdf() {
    window.open(this.pdfUrl, '_blank');
  }

  downloadPdfAgua() {
    window.open(this.pdfUrlAgua, '_blank');
  }

  downloadPdfEnergia() {
    window.open(this.pdfUrlEnergia, '_blank');
  }


  onBuildingSelectionChange(event: any) {
    if (event.value === 'VILLA LUZ') {
      // Avanzar al siguiente paso y omitir el paso de "Tipo de Contratante"
      this.stepper.next(); // Avanza al siguiente paso (si hay un paso intermedio)
      this.stepper.selectedIndex = 3; // Configura el índice del paso al paso de servicios (asume que es el paso 3)
    } else {
      this.stepper.next(); // Avanza al siguiente paso para otros valores
    }
  }

}

