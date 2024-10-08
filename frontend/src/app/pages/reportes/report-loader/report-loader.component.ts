import { Component, Input } from "@angular/core";


@Component({
  selector: "report-loader",
  template: `
    <ng-container>
      <nz-result nzStatus="info"> </nz-result>
      <h1 class="text-center">Selecciona un {{textLoader}} para visualizar</h1>
      <nz-list
        [nzDataSource]="listData"
        [nzRenderItem]="item"
        [nzItemLayout]="'vertical'">
        <ng-template #item let-item>
          <nz-list-item
            [nzContent]="loading ? ' ' : item.content"
            [nzActions]="loading ? [] : [starAction, likeAction, msgAction]"
            [nzExtra]="loading ? null : extra">
            <nz-skeleton
              [nzLoading]="loading"
              [nzActive]="true"
              [nzAvatar]="false">
              <ng-template #starAction>
                <span nz-icon nzType="star-o" style="margin-right: 8px"></span>
                156
              </ng-template>
              <ng-template #likeAction>
                <span nz-icon nzType="like-o" style="margin-right: 8px"></span>
                156
              </ng-template>
              <ng-template #msgAction>
                <span nz-icon nzType="message" style="margin-right: 8px"></span>
                2
              </ng-template>
              <nz-list-item-meta
                [nzAvatar]="item.avatar"
                [nzTitle]="nzTitle"
                [nzDescription]="item.description">
                <ng-template #nzTitle>
                  <a href="{{ item.href }}">{{ item.title }}</a>
                </ng-template>
              </nz-list-item-meta>
              <ng-template #extra>
                <img
                  width="272"
                  alt="logo"
                  src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png" />
              </ng-template>
            </nz-skeleton>
          </nz-list-item>
        </ng-template>
      </nz-list>
    </ng-container>
  `,
})
export class ReportLoaderComponent {

  @Input() loading = false;
  @Input() textLoader = 'reporte';

  listData = new Array(3).fill({}).map((_i, index) => ({
    href: "http://ng.ant.design",
    title: `ant design part ${index}`,
    // avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      "Ant Design, a design language for background applications, is refined by Ant UED Team.",
    content:
      "We supply a series of design principles, practical patterns and high quality design resources " +
      "(Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
  }));
}
