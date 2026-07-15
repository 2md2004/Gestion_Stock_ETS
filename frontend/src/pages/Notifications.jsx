import '../styles/Notifications.css'

const notifications = [
  {
    id: 1,
    type: 'danger',
    title: 'Stock faible',
    message: 'Le ciment est presque en rupture de stock.',
    date: 'Aujourd’hui à 10:30'
  },
  {
    id: 2,
    type: 'success',
    title: 'Nouvelle vente',
    message: 'Une vente de 45 000 FCFA a été enregistrée.',
    date: 'Aujourd’hui à 09:15'
  },
  {
    id: 3,
    type: 'warning',
    title: 'Réapprovisionnement',
    message: 'Une nouvelle livraison est arrivée.',
    date: 'Hier à 16:40'
  }
]


const icons = {

  danger: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2L1 21h22L12 2zm1 15h-2v2h2v-2zm0-2h-2v-6h2v6z"/>
    </svg>
  ),

  success: (
    <svg viewBox="0 0 24 24">
      <path d="M9 16.2l-3.5-3.5L4 14.2l5 5L20 8.2 18.5 6.7z"/>
    </svg>
  ),

  warning: (
    <svg viewBox="0 0 24 24">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6V5h12v14z"/>
    </svg>
  )

}


const Notifications = () => {

  return (

    <div className="notificationsPage">

      <div className="notificationsCard">

        <div className="notificationsHeader">

          <h2>
            Notifications
          </h2>

          <span>
            {notifications.length} notifications
          </span>

        </div>



        <div className="notificationsList">


          {
            notifications.map((notification)=>(


              <div
                key={notification.id}
                className="notificationRow"
              >


                <div className={`notificationIcon ${notification.type}`}>

                  {icons[notification.type]}

                </div>



                <div className="notificationInfo">


                  <h3>
                    {notification.title}
                  </h3>


                  <p>
                    {notification.message}
                  </p>


                  <small>
                    {notification.date}
                  </small>


                </div>


              </div>


            ))
          }


        </div>


      </div>


    </div>

  )

}


export default Notifications