import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { AutoComplete } from 'material-ui';
import RaisedButton from 'material-ui/RaisedButton';
import TAG_SEARCH from '../graphql/tagSearch.query';
import ApolloClientManager from '../util/ApolloClientManager.class';

const styles = {
  toolbar: {
    backgroundColor: '#4285f4',
    width: '100%',
    height: '130px',
  },
  toolbarGroup: {
    width: '100%',
  },
  autoComplete: {
    width: '80%',
    height: '40%',
  },
  textField: {
    width: '100%',
    fontSize: '28px',
    lineHeight: '28px',
  },
  underline: {
    borderColor: 'white',
  },
  hint: {
    color: 'white',
  },
  input: {
    color: 'white',
  },
};

class SearchBar extends Component {
  constructor() {
    super();
    this.state = {
      searchTerm: '',
      matchedTags: [],
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onUpdateInput(value) {
    this.setState(prevState => ({
      ...prevState,
      searchTerm: value,
    }));
    if (!value.startsWith('#')) {
      this.setState(prevState => ({
        ...prevState,
        matchedTags: [],
      }));
      return;
    }
    ApolloClientManager.makeQuery(
      TAG_SEARCH,
      {
        searchKey: value.substr(1),
      },
      ({ data: { tagSearch: matchedTags } }) => {
        this.setState(prevState => ({
          ...prevState,
          matchedTags,
        }));
      },
      (error) => {
        console.error('Error:', error);
      },
    );
  }

  onSubmit() {
    const { onSearch, onSubscribe } = this.props;
    const { searchTerm, matchedTags } = this.state;
    if (searchTerm.startsWith('#')) {
      onSubscribe(
        matchedTags.find(({ key }) => key === searchTerm.substr(1)).tagID,
        () => {
          this.setState({
            searchTerm: '',
            matchedTags: [],
          });
        },
      );
    } else {
      onSearch(searchTerm);
    }
  }

  render() {
    const { searchTerm, matchedTags } = this.state;
    return (
      <Toolbar style={styles.toolbar}>
        <ToolbarGroup style={styles.toolbarGroup}>
          <AutoComplete
            style={styles.autoComplete}
            textFieldStyle={styles.textField}
            inputStyle={styles.input}
            hintText={'請輸入關鍵字...'}
            underlineStyle={styles.underline}
            underlineFocusStyle={styles.underline}
            hintStyle={styles.hint}
            searchText={searchTerm}
            onKeyPress={({ key }) => { if (key === 'Enter') this.onSubmit(); }}
            dataSource={matchedTags.map(({ key }) => `#${key}`)}
            onUpdateInput={this.onUpdateInput}
          />
          <RaisedButton size={'large'} onClick={this.onSubmit}>
            {searchTerm.startsWith('#') ? '訂閱' : '搜尋'}
          </RaisedButton>
          <div className={'header--hint-text'}>或以#開頭訂閱Tag</div>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

SearchBar.propTypes = {
  onSearch: PropTypes.func,
  onSubscribe: PropTypes.func,
};

SearchBar.defaultProps = {
  onSearch: () => {},
  onSubscribe: () => {},
};

export default SearchBar;
