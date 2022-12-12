import './Error.css';

function Error(props) {
	return (
    <div className="Error">
		<article className="message is-danger">
  			<div className="message-body">
    			{ props.message.map((line,i) => <p key={ i }>{ line }</p>) }
  			</div>
		</article>
    </div>
  );
}

export default Error;