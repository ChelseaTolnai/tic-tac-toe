/*
  Creating screen wrapper so that all pages always include
  a main landmark and a header level 1.
  Also all pages will have similar container styling. 
*/

interface WrapperProps {
  title: string;
  children: JSX.Element
}

const ScreenWrapper = (props: WrapperProps) => (
  <main className='container text-center my-4'>
    <h1>{props.title}</h1>
    {props.children}
  </main>
);

export default ScreenWrapper;