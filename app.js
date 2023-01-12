class Despesa{
    constructor(ano,mes,dia,tipo,descricao,valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
      for(let i  in this ){
        if(this[i] === "" || this[i] === undefined || this[i] === null){
          return false;
        }
      }

      return true;
    }
}

class Bd{

  constructor(){
    let id = localStorage.getItem('id');

    if(id === null){
      localStorage.setItem('id',0);
    }
  }
  
  getProximoId(){
    let proximoId = (parseInt(localStorage.getItem('id')) + 1);    
    return proximoId;
  }
  
  gravar(d){
    
    localStorage.setItem(this.getProximoId(), JSON.stringify(d));    
    localStorage.setItem('id',this.getProximoId());
  }


  limpar(){

    document.getElementById('ano').value = '';
    document.getElementById('mes').value = '';
    document.getElementById('dia').value = '';
    document.getElementById('tipo').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('valor').value = '';

  }

  recuperarTodosOsRegistros(){
    let id = localStorage.getItem('id');
    let despesas = [];
    for(let x=0; x <= id; x++){
      let despesaRegistrada =  JSON.parse(localStorage.getItem(x));

      if(despesaRegistrada === null){
        continue;
      }

      despesaRegistrada.id = x;
      despesas.push(despesaRegistrada);
    }

    return despesas;

  }

  pesquisar(despesa){

    let despesasFiltradas = Array();

    despesasFiltradas = this.recuperarTodosOsRegistros();

    
    if(despesa.ano!=''){
      despesasFiltradas = despesasFiltradas.filter(f=> f.ano === despesa.ano );
    }
    if(despesa.mes!=''){
      despesasFiltradas = despesasFiltradas.filter(f=> f.mes === despesa.mes );
    }
    if(despesa.dia!=''){
      despesasFiltradas = despesasFiltradas.filter(f=> f.dia === despesa.dia );
    }
    if(despesa.tipo!=''){
      despesasFiltradas = despesasFiltradas.filter(f=> f.tipo === despesa.tipo );
    }
    if(despesa.descricao!=''){
      despesasFiltradas = despesasFiltradas.filter(f=> f.descricao.indexOf(despesa.descricao) > -1 );
    }
    if(despesa.valor!=''){
      despesasFiltradas = despesasFiltradas.filter(f=> f.valor === despesa.valor );
    }


    console.log(despesa);
    console.log(despesasFiltradas)

    return despesasFiltradas;

  }

  remover(key){

    localStorage.removeItem(key);
  }
  
  
}

let bd = new Bd();

function cadastrarDespesa() {

  let ano = document.getElementById('ano')
  let mes = document.getElementById('mes')
  let dia = document.getElementById('dia')
  let tipo = document.getElementById('tipo')
  let descricao = document.getElementById('descricao')
  let valor = document.getElementById('valor')

  

  let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value);
  if(despesa.validarDados()){
    let bd = new Bd();

    bd.gravar(despesa);

    bd.limpar();

    document.getElementById('tituloModalLabel').innerHTML = 'Sucesso Registro';
    document.getElementById('bodyModal').innerHTML = 'Registro salvo com sucesso.';
    document.getElementById('buttonModal').innerHTML = 'Continuar';
    document.getElementById('buttonModal').className = 'btn btn-secondary btn-success';
    document.getElementById('titulo_modal_div').className = 'modal-header text-success';
    $(modalRegistraDespesa).modal('show');    
  } else {
    document.getElementById('tituloModalLabel').innerHTML = 'Erro ao salvar';
    document.getElementById('bodyModal').innerHTML = 'Existem campos obrigatórios que não foram preenchidos.'
    document.getElementById('buttonModal').innerHTML = 'Voltar e Corrigir';
    document.getElementById('buttonModal').className = 'btn btn-secondary btn-danger';
    document.getElementById('titulo_modal_div').className = 'modal-header text-danger';
    $(modalRegistraDespesa).modal('show');    
  }
  
}

function carregaListaDespesas() {
  
  let despesas = [];
  
  despesas = pesquisarDespesas();
  
  let listaDespesas = document.getElementById('tbody_despesas');
  listaDespesas.innerHTML = '';
  
  despesas.forEach( d => {

    let linha = listaDespesas.insertRow();
    
    linha.insertCell(0).innerHTML = this.montarData(d.dia,d.mes, d.ano);
    linha.insertCell(1).innerHTML = this.retornarTipo(d.tipo);
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    let btn = document.createElement("button");
    btn.className = "btn btn-danger" ;
    btn.innerHTML = "<i class = 'fas fa-times'></i>";    
    btn.onclick = function(){
      
      bd.remover(d.id)
      
      carregaListaDespesas();
      //window.location.reload();
    }
    
    linha.insertCell(4).append(btn);
  } );  
  

  

}

function montarData(dia, mes, ano){
  return dia+"/"+mes+"/"+ano;
}

function retornarTipo(t){
  switch(parseInt(t)){
    case 1:
      return "Alimentação"
    case 2:
      return "Educação"
    case 3:
      return "Lazer"
    case 4:
      return "Saude"
    case 5:
      return "Transporte"
    default:
      throw('Tipo não registrado');
  }

}

function filterObject(obj, callback) {
  return Object.fromEntries(Object.entries(obj).
    filter(([key, val]) => callback(val, key)));
}


function pesquisarDespesas(){
    
  let despesa = new Despesa(ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value);

  return bd.pesquisar(despesa);
        
  

}