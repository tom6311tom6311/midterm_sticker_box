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
    height: '166px',
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
      dataSource: [],
    };
    this.onUpdateInput = this.onUpdateInput.bind(this);
  }

  onUpdateInput(value) {
    if (!value.startsWith('#')) return;
    ApolloClientManager.makeQuery(
      TAG_SEARCH,
      {
        searchKey: value.substr(1),
      },
      ({ data: { tagSearch: tagList } }) => {
        this.setState(prevState => ({
          ...prevState,
          dataSource: tagList.map(({ key }) => `#${key}`),
        }));
      },
      (error) => {
        console.error('Error:', error);
      },
    );
  }

  render() {
    const { onChange, onSubmit } = this.props;
    const { dataSource } = this.state;
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
            onChange={onChange}
            onKeyPress={({ key }) => { if (key === 'Enter') onSubmit(); }}
            dataSource={dataSource}
            onUpdateInput={this.onUpdateInput}
          />
          <RaisedButton size={'large'} onClick={onSubmit}>
            搜尋
          </RaisedButton>
          <div className={'header--hint-text'}>或以#開頭搜尋Tag</div>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

SearchBar.propTypes = {
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
};

SearchBar.defaultProps = {
  onChange: () => {},
  onSubmit: () => {},
};

export default SearchBar;
