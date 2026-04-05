import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login');
}


// import Login from './login/page';

// export default function Home() {
//   return <Login />;
// }