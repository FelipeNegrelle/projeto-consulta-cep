// document.addEventListener("DOMContentLoaded", _ => {
    const inputCep = document.querySelector('[name="cep"]'),
        alertMessage = document.querySelector(`[data-alert]`),
        mascaraCep = cep => cep.replace(/\D/g, '').replace(/^([0-9]{5})([0-9]{3})$/, '$1-$2');

    inputCep.addEventListener('input', e => {
        e.target.value = mascaraCep(e.target.value);
        (e.target.value.length === 9) && (pesquisacep(e.target.value));
    }); 
    inputCep.addEventListener('blur', e => {
        (e.target.value.length < 9) && (limpa_formulário_cep(), handleMessage("Formato de CEP inválido."));
    });

    function handleMessage(message, limpar = false) {
        alertMessage.textContent = message;
        if (limpar) {
            alertMessage.classList.remove('alert-danger')
        }
        else {
            alertMessage.classList.add('alert-danger');
        }
    }
    //Limpa valores do formulário de cep.
    function limpa_formulário_cep() {
        document.querySelectorAll('input').forEach(input => input.value = '');
    
    }
    
    function meu_callback(response) {
        if (!("erro" in response)) {
            //Atualiza os campos com os valores.
            document.querySelectorAll('input').forEach(input => 
                (Object.keys(input.dataset).pop()) && (input.value = response[Object.keys(input.dataset).pop()]));
            handleMessage('', true);
        } else {
            //CEP não Encontrado.
            limpa_formulário_cep();
            handleMessage("CEP não encontrado.");
        }
    }
    
    function pesquisacep(valor) {
        //Nova variável "cep" somente com dígitos.
        const cep = valor.replace(/\D/g, '');
    
        //Verifica se campo cep possui valor informado.
        if (cep != "") {
    
            //Expressão regular para validar o CEP.
            const validacep = /^[0-9]{8}$/;
    
            //Valida o formato do CEP.
            if(validacep.test(cep)) {
                //Preenche os campos com "Buscando..." enquanto consulta webservice.
                document.querySelectorAll('input').forEach(input => 
                    (Object.keys(input.dataset).pop()) && (input.value = 'Buscando...'));
    
                //Cria um elemento javascript.
                const script = document.createElement('script');
    
                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';
    
                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);
    
            }// } else {
            //     //cep é inválido.
            //     limpa_formulário_cep();
            //     alert("Formato de CEP inválido.");
            // }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    }
// });
