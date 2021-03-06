import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { load } from '../../redux/modules/admin/singlePageList';
import { del } from '../../redux/modules/admin/singlePage';
import connectData from '../../helpers/connectData';
import Alert from '../../components/Alert';
import PageList from '../../components/PageList';
import State from './State';

function fetchData(getState, dispatch, location) {
  return dispatch(load({params: {...location.query, x: 'singlePage'}}));
}

@connectData(fetchData)
@connect(
  state => ({
    list: state.adminSinglePageList,
    detail: state.adminSinglePage
  }),
  { del, load }
)
export default class SinglePageList extends Component {
  state = {
    showAlert: false
  }
  render() {
    let
      props = this.props,
      list = props.list,
      detail = props.detail;

    if (list.data && list.data.data) {
      let
        {xData, pageList} = list.data.data;

      return (
        <div className="main">
          <Link to={ADMINPATH + 'singlePage'} className="btn">新增</Link>&nbsp;&nbsp;
          <Alert data={detail.deleteData} loading={detail.deleteing} error={detail.deleteError} showAlert={this.state.showAlert} />
          <div className="table2_wrap">
            <table className="table2">
              <tbody>
              <tr>
                <th>序号</th>
                <th>名称</th>
                <th>路径</th>
                <th>操作</th>
              </tr>
              {xData.map((x, i) => {
                return (
                  <tr key={i}>
                    <td>{(pageList.current - 1) * pageList.size + i + 1}</td>
                    <td>{x.title}</td>
                    <td>{x.path}</td>
                    <td>
                      <Link to={ADMINPATH + 'singlePage'} query={{id: x._id}}>编辑</Link>&nbsp;&nbsp;
                      <a href="javascript:void(0)" onClick={this.handleDelete.bind(this, x._id)}>删除</a>
                    </td>
                  </tr>
                )
              })}
              </tbody>
            </table>
          </div>
          <PageList {...pageList} path={ADMINPATH + 'singlePageList'} />
        </div>
      )
    } else {
      return <State {...list} />
    }
  }
  handleDelete(id) {
    let props = this.props;

    props.del({params: {x: 'singlePage', id}}).then(() => {
      this.setState({showAlert: true});
      props.load({params: {...props.location.query, x: 'singlePage'}});
    }, () => {
      this.setState({showAlert: true});
    });
  }
};