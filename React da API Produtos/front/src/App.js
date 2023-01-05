import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {

  //ObjetoProduto
  const produto = {
    codigo : 0,
    nome : '',
    marca : ""
  }

  //UseState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);

  //UseEffects
  useEffect(()=>{
    fetch("http://localhost:8080/listar")
    .then(retorno => retorno.json())
    .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  //Obtendo os dados do Formulário
  const aoDigitar = (e) => {
    setObjProduto({...objProduto, [e.target.name]:e.target.value});
  } 

  //Cadastrar Produto
  const cadastrar = () => {
    fetch('http://localhost:8080/cadastrar', {
      method: 'post',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type':'application/json',
        'Accept': 'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
    
        if(retorno_convertido.mensagem !== undefined){
          alert(retorno_convertido.mensagem);
        }else{
          setProdutos([...produtos, retorno_convertido]);
          alert('Produto cadastrado com sucesso!')
          limparFormulario();
        }

    })
  }


  //Alterar Produto
  const alterar = () => {
    fetch('http://localhost:8080/alterar', {
      method: 'put',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type':'application/json',
        'Accept': 'application/json'
      }
    })
    .then(retorno => retorno.json())
    .then(retorno_convertido => {
    
        if(retorno_convertido.mensagem !== undefined){
          alert(retorno_convertido.mensagem);
        }else{
          //Mensagem
          alert('Produto alterado com sucesso!');

          //Cópia do Vetor de Produtos
          let vetorTemp = [...produtos];

          //Índice
          let indice = vetorTemp.findIndex((p) => {
            return p.codigo === objProduto.codigo;
          });

          //Alterar produto do vetorTemp
          vetorTemp[indice] = objProduto;

          //Atualizar vetor de produtos
          setProdutos(vetorTemp);
          
          //Limpar Formuário
          limparFormulario();
        }

    })
  }

//Remover Produto
const remover = () => {
  fetch('http://localhost:8080/remover/'+objProduto.codigo, {
    method: 'delete',
    headers: {
      'Content-type':'application/json',
      'Accept': 'application/json'
    }
  })
  .then(retorno => retorno.json())
  .then(retorno_convertido => {

    //Mensagem
    alert(retorno_convertido.mensagem);

    //Cópia do Vetor de Produtos
    let vetorTemp = [...produtos];

    //Índice
    let indice = vetorTemp.findIndex((p) => {
      return p.codigo === objProduto.codigo;
    });

    //Remover produto do vetorTemp
    vetorTemp.splice(indice, 1);

    //Atualizar vetor de produtos
    setProdutos(vetorTemp);

    //Limpar Formulário
    limparFormulario();

  })
}


  //Limpar Formulário
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  //Selecionar Produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }


  //Retorno
  return (
    <div>
      <Formulario botao={btnCadastrar} eventoTeclado = {aoDigitar} cadastrar={cadastrar} obj={objProduto} cancelar={limparFormulario} remover={remover} alterar={alterar}></Formulario>
      <Tabela vetor={produtos} selecionar={selecionarProduto}></Tabela>
    </div>
  );
}

export default App;
