import React, { Component } from 'react';

import api from '../../services/api';
import Container from '../../components/Container';
import { FaGithub, FaPlus, FaSpinner } from 'react-icons/fa';
import { Form, SubmitButton, List } from './styles';
import { Link } from 'react-router-dom';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: false,
  };

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    const { newRepo, repositories } = this.state;
    try {
      let { data } = await api.get(`/repos/${newRepo}`);
      data = { name: data.full_name };
      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: false,
      });
    } catch {
      this.setState({ loading: false });
    }
  };

  componentDidMount() {
    const repositories = JSON.parse(localStorage.getItem('repositories'));
    this.setState({ repositories: repositories ? repositories : [] });
  }

  componentDidUpdate(_, { prevRepositories }) {
    const { repositories } = this.state;
    if (prevRepositories !== repositories)
      localStorage.setItem('repositories', JSON.stringify(repositories));
  }

  render() {
    const { newRepo, loading, repositories } = this.state;
    return (
      <Container>
        <h1>
          <FaGithub />
          Repositórios
        </h1>

        <Form onSubmit={this.handleSubmit}>
          <input
            type="text"
            placeholder="Adicionar repositório"
            value={newRepo}
            onChange={this.handleInputChange}
          />
          <SubmitButton loading={loading ? 1 : 0}>
            {loading ? (
              <FaSpinner color="#fff" size={14} />
            ) : (
              <FaPlus color="#fff" size={14} />
            )}
          </SubmitButton>
        </Form>

        <List>
          {repositories.map(repository => {
            return (
              <li key={repository.name}>
                <span>{repository.name}</span>
                <Link to={`/repository/${encodeURIComponent(repository.name)}`}>
                  Detalhes
                </Link>
              </li>
            );
          })}
        </List>
      </Container>
    );
  }
}
