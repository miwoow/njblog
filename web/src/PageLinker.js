import React from 'react';

class PageLinker extends React.Component {

    constructor(props) {
        super(props);
        this.clickEvent = this.clickEvent.bind(this);
    }

    clickEvent(e) {
        if(this.props.className.indexOf('disabled')<0 && this.props.className.indexOf('active')<0){
			this.props.callBack(this.props.index);
		}
    }

    render() {
        return (
			<li className={this.props.className} onClick={this.clickEvent}><a href="javascript:void(0)">{this.props.text}</a></li>
		);
    }
}

export default PageLinker;
