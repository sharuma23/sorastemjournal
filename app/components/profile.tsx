interface profileData {
  imageLink: string;
  name: string;
}

export default function Profile(props: profileData) {
  return (
    <div className="card">
      <img src={props.imageLink}/>
      <div className="name">{props.name}</div>
    </div>
  )
}