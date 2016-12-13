import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.*;
import java.util.HashMap;
import java.util.Scanner;

/**
 * Created by bowang on 12/3/16.
 */
public class emailNum {
    public static void main(String[] args) throws IOException, JSONException {
        File file = new File("Jan");
        Scanner scanner = new Scanner(new FileInputStream(file));
        StringBuilder sb = new StringBuilder();
        while (scanner.hasNextLine()) {
            sb.append(scanner.nextLine());
        }
        JSONArray array = new JSONArray(sb.toString());
        HashMap<String, Integer> map = new HashMap<>();
        for (int i = 0; i < array.length(); i++) {
            String emailF = ((JSONObject)array.get(i)).get("from").toString();
            if (map.containsKey(emailF)) {
                map.put(emailF, map.get(emailF) + 1);
            } else {
                map.put(emailF, 1);
            }
            JSONArray jsonArray = ((JSONArray)(((JSONObject)array.get(i)).get("to")));
            for (int j = 0; j < jsonArray.length() ; j++) {
                String emailT =  jsonArray.get(j).toString();
                if (map.containsKey(emailT)) {
                    map.put(emailT, map.get(emailT)  + 1);
                } else {
                    map.put(emailT, 1);
                }
            }
        }

        File emailNum = new File("JanEN");
        FileWriter writer = new FileWriter(emailNum);
        for (String x : map.keySet()) {
            JSONObject obj = new JSONObject();
            obj.put("email", x);
            obj.put("num", map.get(x).toString());
            writer.write(obj.toString() + ",\n");
        }
        writer.close();
    }
}
