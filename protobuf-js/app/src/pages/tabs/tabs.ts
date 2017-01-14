import {Component} from '@angular/core';
import {JsonPage} from "../json/json";
import {ProtobufPage} from "../protobuf/protobuf";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = JsonPage;
  tab2Root: any = ProtobufPage;
}
