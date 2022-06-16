import { Link } from "@remix-run/react";
import { defaultMaxListeners } from "events";
import { useEffect, useState } from "react";
import banana from "public/defaultbanana.png"


interface Props {
  pfpUrl?: string,
  articleID?: string,
}

export default function ProfileBubble({ pfpUrl, articleID }: Props) {
  const [overlay, setOverlay] = useState<boolean>(false);

  const styles = {
    container: {
      backgroundImage: pfpUrl ? `url('${pfpUrl}')` :  `url('${banana}')`
    }
  } as const;


  return (
    <div className="relative">
      <div
        style={styles.container}
        className={`p-36 rounded-full border-8 border-color-blue-50 bg-cover bg-center cursor-pointer hover:border-color-black`}
        onMouseEnter={() => setOverlay(!overlay)}
      >
      </div>

      {overlay &&
        <Link to={`articles/${articleID}`}
          className="p-36 rounded-full border-8 absolute inset-0 bg-black"
          onMouseLeave={() => setOverlay(!overlay)}
        >

        </Link>
      }

    </div>
  )
}