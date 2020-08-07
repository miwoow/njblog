import React from 'react';
import PageLinker from './PageLinker'

class Pager extends React.Component {

    constructor(props) {
        super(props);
        console.log(props);
        this.state = {goIndex:''};
        this.goIndexChanged = this.goIndexChanged.bind(this);
        this.goClicked = this.goClicked.bind(this);
    }

    static defaultProps = {
        totalCount:0,
        firstText:'First',
        prevText:'Prev',
        nextText:'Next',
        lastText:'Last',
        showLinkNum:10 ,//如果设置小于0的数字，那么则不显示数字标签
        alwaysShow:true,//当总页数只有一页时是否显示
        goWidth:50,//跳转输入框的宽度
        recordTextFormat: '{0}/{1}' //{0}对应当前页 {1}对应总页数 {2}对应总记录数 如果不希望显示此部分内容，将此部分赋空值
    };

    callBack(index) {
        this.props.callBack(index);
    }

    getPageLink(p) {
        return <PageLinker key={p.Key} text={p.Text} index={p.Index} className={p.ClassName} callBack={this.callBack}/>;
    }

    goIndexChanged(e) {
        var n = parseInt(e.target.value);
		var v='';
		if(!isNaN(n)&&n>0){
			v= Math.min(n,this.getTotalPages())+'';
		}
		this.setState({goIndex:v});
    }

    getTotalPages() {
        return Math.ceil(this.props.totalCount / this.props.pageSize);

    }

    goClicked(e) {
        var idx = ~~this.state.goIndex -1;
		if(idx>=0&& idx!==this.props.pageIndex){
			this.callBack(idx);
			this.setState({goIndex:''});
		}

    }

    render() {
        var display='';
		if(!this.props.alwaysShow || this.props.totalCount === 0){
			display = this.props.totalCount<=this.props.pageSize?'none':'';
		}
		var totalPages = this.getTotalPages();
		var arr=[];
		var prevDisplay = 0===this.props.pageIndex?'disabled':'';
		var lastDisplay = totalPages-1===this.props.pageIndex?'disabled':'';
		arr.push(
			this.getPageLink({
				Key : "F",
				Text :  this.props.firstText,
				Index : 0,
				ClassName : prevDisplay
			})
		);
		arr.push(
			this.getPageLink({
				Key : "P",
				Text :  this.props.prevText,
				Index : Math.max(this.props.pageIndex - 1,0),
				ClassName : prevDisplay
			})
		);
		if(this.props.showLinkNum > 0){
			//PageIndex从0开始计算
			var startIndex = ~~(this.props.pageIndex / this.props.showLinkNum) * this.props.showLinkNum;
			var endIndex = Math.min(startIndex + this.props.showLinkNum,totalPages);
			for(var i=startIndex;i<endIndex;i++){
				arr.push(
					this.getPageLink({
						Key : i,
						Text :  i + 1,
						Index : i,
						ClassName : i===this.props.pageIndex?'active':''
					})
				);
			}
		}
		arr.push(
			this.getPageLink({
				Key : "N",
				Text :  this.props.nextText,
				Index : Math.min(this.props.pageIndex + 1,totalPages - 1),
				ClassName : lastDisplay
			})
		);
		arr.push(
			this.getPageLink({
				Key : "L",
				Text :  this.props.lastText,
				Index : totalPages - 1,
				ClassName : lastDisplay
			})
		);
		if(totalPages>this.props.showLinkNum){//显示快速跳转输入框
			arr.push(
				<li key="G">
					<div className="input-group" style={{display:'inline-block',float:'left'}}>
						<input type="text" className="form-control" maxLength={(totalPages+"").length} value={this.state.goIndex} onChange={this.goIndexChanged} style={{width:this.props.goWidth}} />
						<span className="input-group-btn" style={{display:'inline-block'}}>
							<button className="btn btn-default" onClick={this.goClicked} type="button">Go</button>
						</span>
					</div>
				</li>
			);
		}
		if(this.props.recordTextFormat.length>0){//显示文本
			arr.push(
				<li key="T" style={{marginLeft:5}}>
					<span>{this.props.recordTextFormat.replace(/\{0\}/g, this.props.pageIndex + 1)
					.replace(/\{1\}/g, totalPages).replace(/\{2\}/g, this.props.totalCount)}</span>
				</li>
			);
		}
		return (
			<ul className="pagination" style={{margin: '0px 0px',display:display}}>
				{arr}
			</ul>
		);

    }
}

export default Pager;
