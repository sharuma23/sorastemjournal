import { Link } from "@remix-run/react";

interface cardData {
  imageLink: string;
  name: string;
  title: string;
  blurb: string;
  id: string;
  clickable: boolean;
}

export default function Card(props: cardData) {
  return (
    <div className="card">
      {props.clickable ?
        <Link className="title" to={`${props.id}`} prefetch="intent">
          <img src={props.imageLink} />
          <div className="name"> {props.name} </div>
          <div className="title">{props.title}</div>
          <div className="blurb">{props.blurb}</div>
        </Link>
        :
        <>
          <img src={props.imageLink} />
          <div className="name"> {props.name} </div>
          <div className="title">{props.title}</div>
          <div className="blurb">{props.blurb}</div>
        </>
      }

    </div>
  )
}