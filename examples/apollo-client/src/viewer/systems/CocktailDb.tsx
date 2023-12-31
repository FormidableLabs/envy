import { System, Trace } from '@envyjs/webui';
import { TraceContext } from '@envyjs/webui/dist/types';

type CocktailDbData = {
  name: string;
};

export default class CocktailDbSystem implements System<CocktailDbData> {
  name = 'Cocktail Database';

  isMatch(trace: Trace) {
    return trace.http?.host === 'www.thecocktaildb.com';
  }

  getData(trace: Trace) {
    const data = trace.http?.responseBody ? JSON.parse(trace.http?.responseBody) : null;
    return {
      name: data?.drinks[0].strDrink ?? '',
    };
  }

  getIconUri() {
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiB0ZXh0LXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIiBpbWFnZS1yZW5kZXJpbmc9Im9wdGltaXplUXVhbGl0eSIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIHZpZXdCb3g9IjAgMCA1MDUgNTEyLjQ0Ij48cGF0aCBmaWxsPSIjRkRDNDU0IiBkPSJNNDU5LjIzNSAxNDUuNDQ1YzIwLjU3NCA4MS45NDggMTcuMDU0IDE1OS43MjItNTAuMTI0IDE4MS41ODctMzcuNTcyIDEyLjE0OS02Ny45NzkgNy43MDItOTEuNjI5LTEyLjM4OS0zMi44NzQtMjcuOTI5LTQ2LjYzOC03Ny41ODUtNTIuNTk2LTEzMC4xMDUgOTMuNzg4LTQyLjAzOSAxOTYuMDc2LTkyLjU3IDE5NC4zNDktMzkuMDkzeiIvPjxwYXRoIGZpbGw9IiM2ODM4MDAiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTM1Mi45NTEgNTA0LjE4M2MtNy41NTMgMS40NDMtMTQuODUyLTMuNTEyLTE2LjI5Ni0xMS4wNjQtMS40NDMtNy41NTMgMy41MTEtMTQuODUzIDExLjA2NC0xNi4yOTZsNTguNjc0LTExLjM0NS0yNS43MTUtMTI1Ljc2OWMtMS41MzMtNy41MjQgMy4zMjQtMTQuODczIDEwLjg0OS0xNi40MDYgNy41MjUtMS41MzQgMTQuODczIDMuMzIzIDE2LjQwNiAxMC44NDlsMjUuNzc1IDEyNi4wNDIgNTQuNzQ2LTEwLjU4NWM3LjU1My0xLjQ0MyAxNC44NTMgMy41MTEgMTYuMjk2IDExLjA2NCAxLjQ0MyA3LjU1My0zLjUxMSAxNC44NTItMTEuMDY0IDE2LjI5NmwtMTQwLjczNSAyNy4yMTR6Ii8+PHBhdGggZmlsbD0iI0ZEQzQ1NCIgZD0iTTQ5Ljc2OCAxNDUuNDQ1Yy0yMC41NzQgODEuOTQ4LTE3LjA1NCAxNTkuNzIyIDUwLjEyNCAxODEuNTg3IDM3LjU3MiAxMi4xNDkgNjcuOTc5IDcuNzAyIDkxLjYyOS0xMi4zODkgMzIuODc0LTI3LjkyOSA0Ni42MzgtNzcuNTg1IDUyLjU5Ni0xMzAuMTA1LTQ2Ljc2OS01NS40MTUtMTI5LjU2Ni0yNi4wNjItMTk0LjM0OS0zOS4wOTN6Ii8+PHBhdGggZmlsbD0iIzY4MzgwMCIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMjM5Ljk2NyA1NS44MzhjLS42NDktMy44NjItMS45NDYtNi45ODQtMy45MzQtOS4yOTgtMS45NzEtMi4yOTctNC44NjQtNC4wMTEtOC43MTktNS4wOTdsLTc2Ljk3NS0xNS4xNzhjLTQuODc0LS45NjEtOS42OTctMS45OTktMTMuOTQ3LTIuOTExLTIzLjEwMi00Ljk2NS0yMy4yMDctNC45ODUtMzUuNjQxIDI1Ljk0NC0yNy41NjggNjguNTc2LTUwLjE0NiAxMzAuMDAxLTUzLjQ3MyAxNzcuNTg3LTMuMDk1IDQ0LjIzOCAxMS4xNzEgNzYuNDA2IDU1LjYyOCA5MC44NzRsLjQwNi4xNDJjMTcuMTg3IDUuNTAzIDMyLjYwNSA3LjI1NCA0Ni4yODEgNS4zN2wuMjc4LS4wMzRjMTMuMjM5LTEuODY3IDI1LjAxNC03LjI0OCAzNS4zNTMtMTYuMDM2IDUxLjk2Ny00NC4xNTEgNTMuMTMtMTM5LjU1MiA1NC4wNDItMjE0LjYyMi4xNi0xMy4wMjguMzEyLTI1LjQ3OS43MDEtMzYuNzQxek0xMjcuNjY2IDM0Mi45NDNMMTAwLjg4IDQ3My45MjJsNTYuNDAxIDEwLjkwOGM3LjU1MyAxLjQ0NCAxMi41MDcgOC43NDMgMTEuMDY0IDE2LjI5Ni0xLjQ0MyA3LjU1My04Ljc0MyAxMi41MDctMTYuMjk2IDExLjA2NEwxMS4zMTQgNDg0Ljk3NkMzLjc2MSA0ODMuNTMzLTEuMTkzIDQ3Ni4yMzMuMjUgNDY4LjY4YzEuNDQ0LTcuNTUzIDguNzQzLTEyLjUwNyAxNi4yOTYtMTEuMDYzbDU3LjAyMiAxMS4wMjUgMjYuODQtMTMxLjI0N2MtMS4wMS0uMzAyLTIuMDE5LS42MTctMy4wMzYtLjk0M2wtLjQ5Ni0uMTQ2Yy01NS4wOS0xNy45MjYtNzIuODEyLTU3LjA3MS02OS4wNjItMTEwLjcxOCAzLjUxOC01MC4yOTYgMjYuNjM1LTExMy4zNjYgNTQuODQ4LTE4My41NDFDMTAxLjIzMy00LjE1NSAxMDEuNC00LjExNiAxNDAuNDM4IDQuMjcyYzMuODE5LjgxOSA4LjE0MiAxLjc1MyAxMy42NDEgMi44MzVsNzcuNzY5IDE1LjM2OWM4LjAyNSAyLjEyIDE0LjMyMiA1Ljk2NCAxOC45OTIgMTEuMzk0IDQuNjA4IDUuMzU2IDcuNDE0IDEyLjAzOSA4LjU0OCAxOS45MzUuMDY3LjU2Mi4wOTggMS4xMzQuMDc3IDEuNzE3LS40MjMgMTEuNzY1LS41NzYgMjQuMjI3LS43MzUgMzcuMjg1LS45NTggNzguOTk4LTIuMTgzIDE3OS4zODUtNjAuOTEyIDIyOS4yNzgtMTMuMTQzIDExLjE2OC0yOC4yMDMgMTguMDMxLTQ1LjIxMyAyMC40NDJsLS4zNC4wNTVjLTcuODIgMS4wNzktMTYuMDE5IDEuMjA0LTI0LjU5OS4zNjF6Ii8+PHBhdGggZmlsbD0iI2ZmZiIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMjAyLjk5NyAyMjMuMTI4YTUuNTcyIDUuNTcyIDAgMDExMS4wMzMgMS41NjhjLTMuMTE2IDIxLjQ0NC0xMC41MyAzOC41NjItMjEuNzA4IDUxLjg2NC0xMS4yMTMgMTMuMzQzLTI2LjA5MyAyMi43MjEtNDQuMTI0IDI4LjY2NGE1LjU4IDUuNTggMCAwMS03LjA0Mi0zLjU1MyA1LjU4IDUuNTggMCAwMTMuNTUyLTcuMDQzYzE2LjExNi01LjMxMSAyOS4zMTMtMTMuNTY5IDM5LjEwNy0yNS4yMjIgOS44MjUtMTEuNjkyIDE2LjM3Ni0yNi45NjEgMTkuMTgyLTQ2LjI3OHpNMzA5LjAxMSAyNDguMjY0YTUuNTczIDUuNTczIDAgMDExMC4zOC00LjA2YzcuMTQ3IDE4LjE0MiAxNy4wMjUgMzEuNTAyIDI5LjI4OSA0MC42NDggMTIuMjA5IDkuMTA3IDI2LjkzNiAxNC4xMjQgNDMuODE4IDE1LjYwMmE1LjU4MiA1LjU4MiAwIDAxLS45NTcgMTEuMTIyYy0xOC45MzktMS42NTUtMzUuNTgyLTcuMzc2LTQ5LjUzNi0xNy43ODctMTMuOTEyLTEwLjM3Ny0yNS4wNDItMjUuMzQ0LTMyLjk5NC00NS41MjV6Ii8+PHBhdGggZmlsbD0iIzY4MzgwMCIgZmlsbC1ydWxlPSJub256ZXJvIiBkPSJNMjQ5LjYyMiA1My44MDVjMS4xMjQtNy44OTYgMy45MzUtMTQuNTc1IDguNTM5LTE5LjkzNSA0LjY2OS01LjQzIDEwLjk2Ni05LjI3NCAxOC45OTQtMTEuMzk0bDc3Ljc3LTE1LjM2OWM1LjUwNi0xLjA4NiA5LjgxOC0yLjAxNiAxMy42NDEtMi44MzUgMzkuMDM1LTguMzg4IDM5LjIwNC04LjQyMyA1Ny43NzYgMzcuNzc1IDI4LjIxMyA3MC4xNzUgNTEuMzI5IDEzMy4yNDUgNTQuODQ3IDE4My41NDEgMy43NTEgNTMuNjQ3LTEzLjk3NCA5Mi43OTItNjkuMDY1IDExMC43MThsLS40OTYuMTQ2Yy0yMC4wMjEgNi40MTQtMzguMzA1IDguNDE2LTU0Ljg4OCA2LjEzbC0uMzQxLS4wNTVjLTE3LjAxLTIuNDExLTMyLjA3MS05LjI3NC00NS4yMTItMjAuNDQyLTU4LjczNy00OS44OTctNTkuOTU4LTE1MC4yOTQtNjAuOTE2LTIyOS4yOTUtLjE1Ni0xMy4wNTUtLjMwOS0yNS41MTctLjczMi0zNy4yNjgtLjAyMS0uNTgzLjAxLTEuMTU1LjA4My0xLjcxN3ptMjMuMzQ2LTcuMjY1Yy0xLjk4NSAyLjMxLTMuMjg2IDUuNDMzLTMuOTMxIDkuMjk0LjM4OCAxMS4yNjIuNTQxIDIzLjcwNi42OTcgMzYuNzI3LjkxMyA3NS4wNzggMi4wNzUgMTcwLjQ4OSA1NC4wNDYgMjE0LjY0IDEwLjMzOSA4Ljc4OCAyMi4xMTQgMTQuMTY5IDM1LjM1MyAxNi4wMzZsLjI3OC4wMzRjMTMuNjggMS44ODggMjkuMDk0LjEzMyA0Ni4yNzgtNS4zN2wuNDA2LS4xNDJjNDQuNDU2LTE0LjQ2OCA1OC43MjYtNDYuNjM2IDU1LjYzMS05MC44NzQtMy4zMjctNDcuNTg2LTI1LjkwNi0xMDkuMDExLTUzLjQ3My0xNzcuNTg3LTEyLjQzMS0zMC45MjYtMTIuNTM4LTMwLjkwOS0zNS42NDEtMjUuOTQ0LTQuMjU0LjkxMi05LjA4MyAxLjk1My0xMy45NDcgMi45MTFMMjgxLjY5IDQxLjQ0N2MtMy44NTggMS4wODItNi43NDggMi43OTktOC43MjIgNS4wOTN6Ii8+PC9zdmc+';
  }

  getSearchKeywords(context: TraceContext<CocktailDbData>): string[] {
    return [context.data.name];
  }

  getTraceRowData({ data }: TraceContext<CocktailDbData>) {
    return {
      data: data.name,
    };
  }
}
