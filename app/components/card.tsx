import { Link } from "@remix-run/react";

interface cardData {
  imageLink: string;
  name: string;
  title: string;
  blurb: string;
  id: string;
  cardSize: 'wide' | 'tall';
  imageDirection?: 'left' | 'right'
}

export default function Card(props: cardData) {

  if (props.cardSize === 'wide') {
    return (

      <div className='card wide'>

        {props.imageDirection === 'left'
          &&
          <img className="left" src={props.imageLink} alt="my image" />
        }

        <Link
          to={`${props.id}`}
          style={{ textDecoration: 'none' }}
        >
          <div className="text">
            <div className="name"> {props.name} </div>
            <div className="title">{props.title}</div>
            <div className="blurb">{props.blurb}</div>
          </div>
        </Link>

        {// if its a wide card, and its right, render a right image
          props.imageDirection === 'right'
          &&
          <img className="right" src={props.imageLink} alt="my image" />
        }
      </div>
    )
  } else if (props.cardSize === 'tall') {
    return (

      <div className='card tall'>
        <img src={props.imageLink} alt="my image" />
        <Link
          to={`${props.id}`}
          style={{ textDecoration: 'none' }}
        >
          <div className="text">
            <div className="name"> {props.name} </div>
            <div className="title">{props.title}</div>
            <div className="blurb">{props.blurb}</div>
          </div>
        </Link>

      </div>
    )
  } else {
    return (<></>);
  }
}