import getListingById from "@/app/actions/getListingById"
import ClientOnly from "@/app/components/ClientOnly"
import EmptyState from "@/app/components/EmptyState"
import ListingClient from "./ListingClient"
import getCurrentUser from "@/app/actions/getCurrentUser"

interface IParams {
  listingId?:string,
}
const page = async ({params}:{params:IParams}) => {
  const listing = await getListingById(params)
  const currentUser = await getCurrentUser()


  if(!listing){
    return (
      <ClientOnly>
        <EmptyState title="Not found" subtitle="Please, try again or check this listing link." />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <ListingClient
        listing={listing}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}

export default page