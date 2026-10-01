let alunos = [];
let idEditando = null;
let proximoId = 1;
const CHAVE = "alunos_degrau7_master";

function carregar() {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) {
        alunos = JSON.parse(salvo);
        proximoId = alunos.length ? Math.max(...alunos.map(a => a.id)) + 1 : 1;
    }
    listar();
}

function persistir() {
    localStorage.setItem(CHAVE, JSON.stringify(alunos));
}

function listar() {
    const tbody = document.getElementById("lista");
    tbody.innerHTML = "";
    alunos.forEach(a => {
        tbody.innerHTML += `<tr>
            <td>${a.id}</td><td>${a.nome}</td><td>${a.email}</td><td>${a.idade}</td><td>${a.apelido ?? "-"}
            <td>
                <button class="btn-acao btn-amarelo" onclick="editar(${a.id})">Editar</button>
                <button class="btn-acao btn-vermelho" onclick="excluir(${a.id})">Excluir</button>
            </td>
        </tr>`;
    });
}

function salvar() {
    const n = document.getElementById("nome");
    const e = document.getElementById("email");
    const i = document.getElementById("idade");
    const ap = document.getElementById("apelido");
    if (!n.value) return alert("Preencha o nome!");

    if (idEditando) {
        const a = alunos.find(x => x.id === idEditando);
        a.nome = n.value;
        a.email = e.value;
        a.idade = i.value;
        a.apelido = ap.value;
        idEditando = null;
        document.getElementById("btnSalvar").innerText = "Salvar";
    } else {
        alunos.push({ id: proximoId++, nome: n.value, email: e.value, idade: i.value, apelido: ap.value });
    }

    n.value = e.value = i.value = ap.value = "";
    persistir();
    listar();
}

function editar(id) {
    const a = alunos.find(x => x.id === id);
    document.getElementById("nome").value = a.nome;
    document.getElementById("email").value = a.email;
    document.getElementById("idade").value = a.idade;
    document.getElementById("apelido").value = a.apelido
    idEditando = id;
    document.getElementById("btnSalvar").innerText = "Atualizar #" + id;
}

function excluir(id) {
    if (confirm("Excluir este aluno?")) {
        alunos = alunos.filter(a => a.id !== id);
        persistir();
        listar();
    }
}

function exportar() {
    const texto = JSON.stringify(alunos, null, 2);
    const blob = new Blob([texto], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "alunos.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(a.href);
}

function importar(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;

    const leitor = new FileReader();
    leitor.onload = () => {
        try {
            const dados = JSON.parse(leitor.result);
            if (!Array.isArray(dados)) throw new Error("O JSON precisa conter uma lista []");

            alunos = dados;
            proximoId = alunos.length ? Math.max(...alunos.map(a => a.id)) + 1 : 1;

            persistir();
            listar();
            alert("Sucesso! " + alunos.length + " alunos importados.");
        } catch (e) {
            alert("Falha ao importar: " + e.message);
        }
    };
    leitor.readAsText(arquivo);
}

function resetar() {
    if (!confirm("Tem certeza que deseja apagar todo o banco de dados local?")) return;
    localStorage.removeItem(CHAVE);
    alunos = [];
    proximoId = 1;
    listar();
}

carregar();