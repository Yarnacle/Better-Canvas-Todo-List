import './Error.css';

function Error(props) {
	return (
    <div className="Error">
		<article className="message is-danger">
  			<div className="message-body">
    		<p>{ props.message }</p>
  			</div>
</article>
    </div>
  );
}

export default Error;