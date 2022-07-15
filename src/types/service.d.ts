interface IResult<T> {
  code: number;
  msg: string;
  data: T
}