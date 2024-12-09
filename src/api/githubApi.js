import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com",
  timeout: 10000,
});

export async function getUserInfo(token) {
  try {
    const response = await api.get("/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar informações do usuário:", error);
    throw new Error("Não foi possível obter as informações do usuário.");
  }
}

export async function updateIssueState(token, owner, repo, issueNumber, state) {
    try {
      const response = await api.patch(
        `/repos/${owner}/${repo}/issues/${issueNumber}`,
        { state },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar estado da issue ${issueNumber}:`, error);
      throw error;
    }
  }
  


export async function getUserRepos(token, page = 1) {
  try {
    const response = await api.get(`/user/repos?page=${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar repositórios:", error);
    throw new Error("Não foi possível obter os repositórios do usuário.");
  }
}

export async function getUserIssues(token) {
  try {
    const response = await api.get("/issues", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar issues:", error);
    throw new Error("Não foi possível obter as issues atribuídas ao usuário.");
  }
}

export async function getRepoIssues(token, owner, repo) {
  try {
    const response = await api.get(`/repos/${owner}/${repo}/issues`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar issues do repositório ${repo}:`, error);
    throw new Error(
      `Não foi possível obter as issues do repositório ${repo}.`
    );
  }
}

export async function createIssue(token, owner, repo, issueData) {
    try {
      const response = await api.post(
        `/repos/${owner}/${repo}/issues`,
        issueData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Erro ao criar issue no repositório ${repo}:`, error);
      throw error;
    }
  }
  
